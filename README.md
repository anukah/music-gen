PromptWave 
==========

PromptWave is a full-stack web application that generates original music tracks and accompanying album cover art from a single text prompt. It leverages state-of-the-art generative AI models to turn your ideas into a multimedia experience.

Features
--------

*   **Text-to-Music Generation**: Creates original music based on your textual description (e.g., "uplifting electronic music with a catchy melody").
    
*   **Text-to-Image Generation**: Generates a unique album cover that visually represents the mood of your music.
    
*   **Adjustable Duration**: Control the length of the generated audio track.
    
*   **Low-Resource Model**: Uses TinySD for fast and efficient image generation, suitable for consumer hardware.
    
*   **Modern Web Interface**: A sleek, responsive UI built with Next.js and Tailwind CSS.

⚙️ Tech Stack
-------------

The project is divided into a Python backend for AI processing and a TypeScript frontend for the user interface.

| Component   | Technology                 | Purpose                                     |
|-------------|----------------------------|---------------------------------------------|
| Backend     | Python 3.9+                | Core programming language                   |
|             | FastAPI                    | High-performance web framework for the API  |
|             | PyTorch                    | Deep learning framework for running AI models |
|             | Hugging Face transformers  | To run the MusicGen model                   |
|             | Hugging Face diffusers     | To run the TinySD (Stable Diffusion) model  |
| Frontend    | Next.js                    | React framework for the user interface      |
|             | TypeScript                 | Superset of JavaScript for type safety      |
|             | Tailwind CSS               | Utility-first CSS framework for styling     |
|             | Lucide React               | Library for beautiful and consistent icons  |

Setup and Installation
----------------------

To run this project locally, you'll need Git, Python, and Node.js installed. A **CUDA-enabled GPU is highly recommended** for faster generation times, but the models will fall back to using the CPU if one isn't available.

### 1\. Clone the Repository

```bash
git clone https://github.com/anukah/music-gen.git
cd music-gen
```

2. Backend Setup (FastAPI Server)
The backend is responsible for running the AI models.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install the required Python packages
pip install -r requirements.txt

# Run the FastAPI server
# The first time you run this, it will download the AI models (several GBs)
uvicorn main:app --host 0.0.0.0 --port 8000

```

Your backend server is now running at `http://localhost:8000`

3. Frontend Setup (Next.js App)
The frontend provides the user interface in your browser.

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install the required Node.js packages
npm install

# Run the Next.js development server
npm run dev

```

Workflow
--------


The application follows a simple client-server architecture to generate media.

User Input: The user enters a prompt (e.g., "cinematic fantasy music") and selects a duration on the Next.js frontend.

API Request: The frontend sends a `POST` request to the `/generate` endpoint on the FastAPI backend, containing the prompt and duration in a JSON payload.

Music Generation: The backend uses the `facebook/musicgen-small` model to generate an audio waveform based on the user's prompt. The audio is saved as a temporary `.wav` file.

Image Generation: The backend modifies the user's prompt (see below) and feeds it to the `segmind/tiny-sd` model to generate an album cover. The image is saved as a temporary `.png` file.

Data Encoding: Both the audio and image files are read from the disk and encoded into Base64 strings.

API Response: The server sends a single JSON object back to the frontend containing the Base64-encoded audio and image.

Rendering: The Next.js app receives the JSON response, creates Data URLs (e.g., `data:audio/wav;base64,...`) from the Base64 strings, and renders the image and audio player for the user to enjoy.


Model Prompts
-------------

The user's input is processed differently for each model to achieve the best results.

### MusicGen Prompt
The `MusicGen` model uses the user's prompt directly and unmodified.

User Input: `lofi chillhop, relaxing jazz piano, vinyl crackle`

Final MusicGen Prompt: `lofi chillhop, relaxing jazz piano, vinyl crackle`

### TinySD (Album Art) Prompt
To guide the image model toward a specific style, the user's prompt is prepended with keywords. This technique, known as prompt engineering, helps ensure the output looks like album art.

User Input: `lofi chillhop, relaxing jazz piano, vinyl crackle`

Final TinySD Prompt: `album cover art, lofi chillhop, relaxing jazz piano, vinyl crackle, stunning, high resolution`

