// app/page.tsx

"use client";
import { useState } from "react";
import { Music, Zap, Code2, ArrowRight, Image as ImageIcon } from "lucide-react";

// The LoadingAnimation component remains the same
const LoadingAnimation = () => (
  <div className="flex items-center justify-center space-x-1">
    <span className="w-2 h-5 bg-blue-400 rounded-full animate-wavey"></span>
    <span className="w-2 h-5 bg-blue-400 rounded-full animate-wavey delay-75"></span>
    <span className="w-2 h-5 bg-blue-400 rounded-full animate-wavey delay-150"></span>
    <span className="w-2 h-5 bg-blue-400 rounded-full animate-wavey delay-225"></span>
    <span className="w-2 h-5 bg-blue-400 rounded-full animate-wavey delay-300"></span>
  </div>
);

export default function MediaGen() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(
    "80s synthwave, retro futuristic, synth lead, heavy bass"
  );
  const [duration, setDuration] = useState(8);

  const generateMedia = async () => {
    setLoading(true);
    setAudioUrl(null);
    setImageUrl(null);

    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, duration }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      const audioDataUrl = `data:audio/wav;base64,${data.audio}`;
      const imageDataUrl = `data:image/png;base64,${data.image}`;
      
      setAudioUrl(audioDataUrl);
      setImageUrl(imageDataUrl);

    } catch (error: any) {
      console.error("Failed to generate media:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl shadow-purple-500/10 p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                PromptWave
            </h1>
            <p className="text-gray-400 mt-4 flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-md">
                    <Code2 size={18} className="text-blue-400"/>
                    Text
                </span>
                <ArrowRight size={20} />
                <span className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-md">
                    <Music size={18} className="text-purple-400"/>
                    Album
                </span>
            </p>
        </div>
        
        {/* Form Controls */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="font-medium text-gray-300">Prompt</label>
          <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Lofi chillhop, relaxing jazz piano..." className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all" rows={3}/>
        </div>
        <div className="space-y-2">
          <label htmlFor="duration" className="font-medium text-gray-300">
            Duration: <span className="font-bold text-blue-400">{duration} seconds</span>
          </label>
          <input id="duration" type="range" min="5" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"/>
        </div>
        
        {/* Generate Button */}
        <button onClick={generateMedia} disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300">
          {loading ? <LoadingAnimation /> : <><Zap size={20} /> Generate</>}
        </button>

        {/* Media Player & Image Display */}
        {(audioUrl || imageUrl) && (
          <div className="mt-6 border-t border-gray-700 pt-6 space-y-6">
          
            
            {imageUrl && (
                <div className="flex justify-center">
                    <img src={imageUrl} alt="Generated album cover" className="rounded-lg shadow-lg w-full max-w-sm" />
                </div>
            )}
             
            {audioUrl && (
                <audio controls controlsList="nodownload" className="w-full audio-player" src={audioUrl}>
                    Your browser does not support the audio element.
                </audio>
            )}
          </div>
        )}
      </div>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by MusicGen & TinySD</p>
      </footer>
    </main>
  );
}