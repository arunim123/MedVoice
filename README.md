# MedVoice: Clinical-Grade AI Healthcare Assistant

MedVoice is a next-generation telemedicine application that leverages the **Google Gemini Multimodal Live API** to provide a real-time, voice-first healthcare experience. Unlike traditional text chatbots, MedVoice allows patients to speak naturally with an AI agent that can triage symptoms, recommend specialists, book appointments, and process payments in a seamless conversational flow.

![MedVoice Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200&h=400)

## 🚀 Key Features

### 1. 🗣️ Real-Time Voice Intelligence
*   **Low-Latency Interaction**: Powered by Gemini 2.5 Flash Native Audio, offering near-instantaneous voice responses without traditional Speech-to-Text latency.
*   **Audio Visualization**: A dynamic, real-time waveform visualizer that reacts to the user's voice frequency, providing visual feedback during the conversation.
*   **Voice Personalization**: Users can toggle between different AI voice personalities (Zephyr, Puck, Charon, Kore, Fenrir) via the sidebar settings.

### 2. 🏥 Smart Triage & Doctor Discovery
*   **Symptom Analysis**: The AI analyzes spoken symptoms to assess severity (Low, Moderate, High, Emergency) and logs a clinical summary.
*   **Dynamic Doctor Search**: Based on the analysis, the AI queries a database of specialists and renders interactive **Doctor Cards** in the chat stream.
*   **Detailed Profiles**: Users can view doctor bios, education, languages spoken, patient reviews, and live clinic wait times before booking.

### 3. 📅 Appointment Booking & Payments
*   **Conversational Booking**: Select dates and slots purely through voice or UI interaction.
*   **Insurance Integration**: The system automatically calculates out-of-pocket costs based on the user's mock insurance plan coverage.
*   **Simulated Payment Gateway**: A secure-style modal handles transaction processing, generating a digital appointment ticket upon success.

### 4. 🚑 Emergency Guardrails
*   **SOS Mode**: A global panic button immediately halts the AI, turns the UI red, and displays local emergency hotline numbers (112/911).
*   **Auto-Detection**: The AI actively listens for emergency keywords (e.g., "heart attack", "can't breathe") and triggers the emergency protocol automatically.

### 5. 📊 Patient Dashboard (Sidebar)
*   **Health Vitals**: Interactive charts tracking heart rate trends.
*   **Medication Tracker**: A checklist for active prescriptions.
*   **Insurance Card**: Digital view of policy details and validity.
*   **Appointment History**: Log of upcoming and past visits with status badges.
*   **Profile Management**: Edit vital statistics (Height, Weight, Blood Group, Allergies).

### 6. 📂 Utilities
*   **Report Uploader**: Simulate uploading PDF/Image medical reports for the AI to "read" and analyze.
*   **Consultation Summary**: Download a text transcript of the entire consultation for record-keeping.
*   **Suggestion Chips**: Context-aware quick actions for users who prefer tapping over speaking.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Engine**: Google Gemini Multimodal Live API (`gemini-2.5-flash-native-audio-preview`) via WebSockets
*   **Icons**: Lucide React
*   **Audio**: Native Web Audio API (`AudioContext`, `ScriptProcessorNode`)
*   **Build Tool**: Vite (recommended for local use)

---

## 💻 How to Run Locally

### Prerequisites
*   Node.js (v18 or higher)
*   A Google Cloud Project with the **Gemini API** enabled.
*   An API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/medvoice.git
    cd medvoice
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory (or rename `.env.example` if available).
    ```env
    # .env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    # Note: If using the provided mock environment, the key is injected via process.env.API_KEY
    ```

    *Note: In a Vite setup, you might need to access the key via `import.meta.env.VITE_GEMINI_API_KEY` and update `geminiService.ts` accordingly.*

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```

5.  **Access the App**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🌍 How to Deploy

### Option 1: Vercel (Recommended)

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Log in to [Vercel](https://vercel.com/) and click "Add New Project".
3.  Import your repository.
4.  In the **Environment Variables** section, add:
    *   Name: `API_KEY` (or `VITE_GEMINI_API_KEY` depending on your build config)
    *   Value: `your_google_ai_studio_key`
5.  Click **Deploy**.

### Option 2: Netlify

1.  Push your code to Git.
2.  Log in to [Netlify](https://www.netlify.com/).
3.  "New site from Git".
4.  Under "Build settings", set the build command to `npm run build` and publish directory to `dist`.
5.  Under "Advanced build settings" -> "Environment variables", add your API Key.
6.  Deploy Site.

---

## ⚠️ Important Notes

*   **Browser Permissions**: The application requires Microphone access. Ensure you allow permissions when prompted.
*   **Audio Context**: Modern browsers require a user interaction (click) before playing audio. The "Start Session" button handles this.
*   **Mock Data**: This is a demonstration app. Doctors, payments, and medical advice are simulated and should **not** be used for real medical emergencies.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
