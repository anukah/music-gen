PromptWave 🎵🎨
===============

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
