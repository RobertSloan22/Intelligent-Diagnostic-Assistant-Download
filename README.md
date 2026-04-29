TARS Automotive Repair Specialist

AI-Powered OBD2 Diagnostic System

The automotive diagnostic scanner you can have a conversation with.
Built by a developer with real-world technician experience.

🔧 Overview

TARS (Technician Augmented Repair Specialist) is an AI-powered automotive diagnostic platform that integrates directly with OBD2 adapters to provide real-time vehicle analysis, guided diagnostics, and conversational troubleshooting.

This repository contains the installer and Docker setup required to run the full backend system locally.

⚙️ Key Features
🧠 AI Diagnostic Agent
Built with the OpenAI Agents SDK (text-based reasoning)
Integrated with the OpenAI Realtime API (voice diagnostics)
Technician-style reasoning and guided workflows
📡 Live OBD2 Data Streaming
Works with:
ELM327 adapters
OBDLink MX+
Bluetooth + Serial support
🔍 Advanced Diagnostics
Mode 01 (live data)
Mode 03/07 (DTCs)
Mode 06 (on-board test results)
Mode 09 (VIN, calibration IDs)
📊 Session Recording & Analysis
Record full drive sessions
Replay + analyze data
Generate charts and diagnostic summaries
🧪 Guided Diagnostic Workflows
Fuel trim analysis
O2 sensor validation
Catalyst efficiency checks
🏗️ Architecture
[Frontend (Vercel / Local)]
        ↓
[Backend API (Node.js + Express)]
        ↓
[OBD2 Service Layer]
        ↓
[Vehicle ECU via Bluetooth / Serial]

Additional services:

Redis → live data streaming
MongoDB → session storage
Python services → analysis + visualization
🐳 Quick Start (Docker)
1. Pull the Image
docker pull robertsloan2023mit/backend-uds
2. Run the Full System
docker run -d \
  -p 5000:5000 \
  -p 5005:5005 \
  --name tars-backend \
  robertsloan2023mit/backend-uds
3. Verify It’s Running
docker ps

Backend should now be accessible at:

http://localhost:5000
🔌 Connecting to the System
Frontend Access

You can use the hosted frontend:

👉 https://asktarsai.com/signup

Test account:

Email: testing6@aol.com
Password: testing

Or run your own frontend locally and point it to:

https://noobtoolai.ngrok.app
📡 OBD2 Adapter Setup
Supported Adapters
ELM327 (budget adapters)
OBDLink MX+
Connection Types
Web Bluetooth (browser)
Serial COM (Electron app)
Typical Initialization Commands
ATZ       ; Reset
ATE0      ; Echo Off
ATL0      ; Linefeeds Off
ATS0      ; Spaces Off
ATSP0     ; Auto Protocol
🧠 AI Agent Behavior

The system is designed to mimic a real automotive technician workflow:

Intake symptoms
Analyze live data
Identify patterns
Suggest targeted tests
Recommend fixes
Diagnostic Reasoning Includes
Fuel trim analysis (STFT + LTFT)
MAF airflow validation
O2 sensor switching behavior
Load vs RPM correlation
Catalyst efficiency checks
📊 Data & Storage
Service	Purpose
Redis	Live streaming buffer
MongoDB	Session storage
Python	Data analysis + charts
🧪 Example Features
Real-time PID monitoring
Recorded session playback
Multi-session comparison
Automated anomaly detection (experimental)
🔐 Security Notes
Uses JWT authentication
Backend is exposed via HTTPS (ngrok or hosted)
Do not expose ports publicly without proper auth
🛠️ Development Notes
Built with:
TypeScript
Node.js / Express
Docker
Designed for:
Real-time streaming
Low-latency diagnostics
Expandable UDS support
🚧 Roadmap
Full UDS actuator control (bi-directional)
Manufacturer-specific Mode 06 decoding
ML-based fault classification
Autonomous diagnostic loop
Mobile app (iOS / Android)
👨‍🔧 About

TARS was designed and built by a former automotive technician turned software engineer, and tested on real vehicles in a real repair shop environment.

This isn’t just another scan tool — it’s a diagnostic assistant that works with you.

📬 Feedback / Contributions

If you're interested in contributing, testing, or integrating:

Open an issue
Reach out via GitHub
<img width="1918" height="1125" alt="image" src="https://github.com/user-attachments/assets/4674c2ac-490d-4fd4-9868-f539ca84ce0a" />
<img width="1916" height="1150" alt="image" src="https://github.com/user-attachments/assets/f338f692-5764-45c4-bf5e-1d6160725e78" />

<img width="1159" height="1131" alt="Screenshot 2026-04-08 014626" src="https://github.com/user-attachments/assets/1c9a048e-6773-4f86-82b5-3031bb0344d6" />
<img width="1873" height="1192" alt="Screenshot 2026-04-08 201932" src="https://github.com/user-attachments/assets/67a38c4a-128c-4eac-817f-cbe1c4542bbb" />
<img width="1550" height="567" alt="Screenshot 2026-04-13 211230" src="https://github.com/user-attachments/assets/49827da1-bb56-469f-ae60-1bc00143b85f" />
<img width="1918" height="1143" alt="image" src="https://github.com/user-attachments/assets/f0287756-f033-4c91-9476-d04331ce99ba" />

<img width="1918" height="1160" alt="image" src="https://github.com/user-attachments/assets/1ca5bffd-ed13-4788-8ef2-40e8e90787e4" />

<img width="1917" height="1145" alt="image" src="https://github.com/user-attachments/assets/07dabdef-b7f5-4fd8-ad3c-ba016bfdbbf9" />

<img width="639" height="1160" alt="Screenshot 2026-04-15 013450" src="https://github.com/user-attachments/assets/78cf443d-7190-4bbf-b43c-4c6c369eaba7" />
<img width="1919" height="1142" alt="Screenshot 2026-04-14 235846" src="https://github.com/user-attachments/assets/18c2a773-473a-4fa0-9e3c-8ab517b7e3d0" />
<img width="1060" height="1068" alt="Screenshot 2026-04-10 143117" src="https://github.com/user-attachments/assets/680a6426-354f-41f2-9ec1-753ccbecec53" />
<img width="1901" height="1143" alt="image" src="https://github.com/user-attachments/assets/7a92ddaa-dbb8-4010-93a1-9dac70937b70" />

<img width="1912" height="1053" alt="image" src="https://github.com/user-attachments/assets/8e7eeb1c-b5a3-4405-b04e-f923bfd948b5" />
<img width="1897" height="1131" alt="image" src="https://github.com/user-attachments/assets/4589d11a-a447-407d-8797-8ef40e9559f1" />
