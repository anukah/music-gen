# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import scipy
import base64
from pathlib import Path

# --- Image Generation Imports ---
from diffusers import StableDiffusionPipeline

# --- Music Generation Imports ---
from transformers import AutoProcessor, MusicgenForConditionalGeneration

# Initialize FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check for GPU availability
device = "cuda:0" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Use float32 for CPU and float16 for CUDA for better performance
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
print(f"Using torch dtype: {torch_dtype}")


# --- Load Models ---
# Load MusicGen model
music_model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small").to(device)
music_processor = AutoProcessor.from_pretrained("facebook/musicgen-small")

# --- 💡 KEY CHANGE: Load Low-Resource TinySD Model ---
# This model is much smaller and faster than the standard Stable Diffusion.
image_pipe = StableDiffusionPipeline.from_pretrained(
    "segmind/tiny-sd", 
    torch_dtype=torch_dtype
).to(device)


# Define the request and response models
class PromptRequest(BaseModel):
    prompt: str
    duration: int # Duration in seconds

class MediaResponse(BaseModel):
    audio: str  # Base64 encoded audio
    image: str  # Base64 encoded image

# --- Main Generation Endpoint ---
@app.post("/generate", response_model=MediaResponse)
def generate_media(req: PromptRequest):
    # --- 1. Generate Music ---
    print("Generating music...")
    music_inputs = music_processor(
        text=[req.prompt],
        return_tensors="pt",
    ).to(device)
    
    max_new_tokens = int(req.duration * 50)
    audio_values = music_model.generate(**music_inputs, max_new_tokens=max_new_tokens)
    audio_values_cpu = audio_values[0, 0].cpu().numpy()

    audio_path = Path("temp_music_output.wav")
    scipy.io.wavfile.write(
        audio_path,
        rate=music_model.config.audio_encoder.sampling_rate,
        data=audio_values_cpu
    )

    # --- 2. Generate Image ---
    print("Generating image with TinySD...")
    image_prompt = f"album cover art, {req.prompt}, stunning, high resolution"
    # To improve performance for this smaller model, we reduce the inference steps
    generated_image = image_pipe(image_prompt, num_inference_steps=20).images[0]
    
    image_path = Path("temp_cover_output.png")
    generated_image.save(image_path)

    # --- 3. Encode files to Base64 ---
    print("Encoding files to Base64...")
    with open(audio_path, "rb") as f:
        audio_base64 = base64.b64encode(f.read()).decode('utf-8')
        
    with open(image_path, "rb") as f:
        image_base64 = base64.b64encode(f.read()).decode('utf-8')

    # --- 4. Clean up temporary files ---
    audio_path.unlink()
    image_path.unlink()
    
    # --- 5. Return JSON response ---
    print("Done. Returning response.")
    return MediaResponse(audio=audio_base64, image=image_base64)

@app.get("/")
def root():
    return {"status": "ok", "message": "Music & Image Gen Backend is running"}