# ScamShield: Senior & Family Digital Fraud Guardian

ScamShield is an accessible, proactive web application designed to protect elderly citizens and vulnerable demographics from digital fraud, phishing links, and deceptive SMS messages. Built as a hackathon MVP, the platform utilizes real-time AI to analyze text, explain threats in simple terms, and provide direct emergency remediation.

## 🌟 Key Features

* **Real-Time AI Threat Detection:** Integrated with the Google Gemini API (`gemini-1.5-flash`) to rapidly classify messages strictly as *Safe*, *Suspicious*, or *Dangerous*.
* **Accessibility-First Design:** Features a high-contrast, uncluttered UI with large typography, specifically tailored for senior usability.
* **Multilingual Localization:** Dynamic UI translation and analysis output available in English, Hindi (हिन्दी), and Marathi (मराठी).
* **Native Text-to-Speech (TTS):** Integrated `window.speechSynthesis` API reads threat explanations and recommended actions aloud in the selected language's accent for visually impaired users.
* **Emergency Integration:** Displays a high-urgency, one-tap "Call 1930 Cyber Helpline" button exclusively when a *Dangerous* threat is detected.
* **Privacy & Security:** Implements a server-side Edge Function proxy to securely handle Gemini API calls, ensuring API keys are never exposed to the client browser.

## 🛠️ Tech Stack

* **Frontend Framework:** React + Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
* **Backend/Proxy:** Bolt Database Edge Functions

## 🚀 Getting Started

To run this project locally, you will need Node.js installed on your machine and a Google Gemini API key.

**1. Clone the repository**

```bash
git clone https://github.com/cyferspace/scamshield-guardian.git
cd scamshield-guardian

```

**2. Install dependencies**

```bash
npm install

```

**3. Environment Variables**
Create a `.env` file in the root directory and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here

```

**4. Start the development server**

```bash
npm run dev

```

## 🏆 Hackathon Context

This project was developed for the **Aavishkar 2026 Competition** (Category 5: Engineering & Technology). It addresses the growing need for zero-friction, accessible cybersecurity tools for non-technical users, empowering them to independently evaluate digital threats without downloading complex antivirus software.
