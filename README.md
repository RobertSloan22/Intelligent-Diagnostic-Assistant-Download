T.A.R.S Automotive Repair Specialist

Technician Augmented Repair Specialist

<img width="1918" height="1125" alt="image" src="https://github.com/user-attachments/assets/4674c2ac-490d-4fd4-9868-f539ca84ce0a" /> <img width="1916" height="1150" alt="image" src="https://github.com/user-attachments/assets/f338f692-5764-45c4-bf5e-1d6160725e78" />
🔧 Overview

TARS is an AI-powered automotive diagnostic platform that connects directly to a vehicle through an OBD2 adapter and provides real-time, conversational diagnostics.

Built using:

OpenAI Agents SDK (text-based reasoning)
OpenAI Realtime API (live voice interaction)

This repository provides the Dockerized backend system required to run the full diagnostic engine locally.

🧠 What Makes TARS Different
<img width="1159" height="1131" alt="Screenshot 2026-04-08 014626" src="https://github.com/user-attachments/assets/1c9a048e-6773-4f86-82b5-3031bb0344d6" />
Conversational diagnostics (talk to your scan tool)
Real technician-style reasoning
Live data interpretation (not just raw numbers)
Guided troubleshooting workflows
📡 Live Data + Real-Time Analysis
<img width="1873" height="1192" alt="Screenshot 2026-04-08 201932" src="https://github.com/user-attachments/assets/67a38c4a-128c-4eac-817f-cbe1c4542bbb" />
Streams live OBD2 data directly from the vehicle
Analyzes fuel trims, airflow, O2 sensors, and load in real time
Correlates multiple PIDs to detect issues early
🔍 Advanced Diagnostic Capabilities
<img width="1550" height="567" alt="Screenshot 2026-04-13 211230" src="https://github.com/user-attachments/assets/49827da1-bb56-469f-ae60-1bc00143b85f" />

Supports:

Mode 01 — Live Data
Mode 03 — Stored DTCs
Mode 07 — Pending DTCs
Mode 06 — On-board tests
Mode 09 — VIN + calibration data
📊 Session Recording & Playback
<img width="1918" height="1143" alt="image" src="https://github.com/user-attachments/assets/f0287756-f033-4c91-9476-d04331ce99ba" />
Record full drive sessions
Replay and inspect vehicle behavior
Generate analysis and charts
🧪 Diagnostic Workflows
<img width="1918" height="1160" alt="image" src="https://github.com/user-attachments/assets/1ca5bffd-ed13-4788-8ef2-40e8e90787e4" />

TARS follows a structured diagnostic approach:

Intake symptoms
Analyze live data
Identify patterns
Suggest targeted tests
Recommend fixes
🔬 Deep System Insight
<img width="1917" height="1145" alt="image" src="https://github.com/user-attachments/assets/07dabdef-b7f5-4fd8-ad3c-ba016bfdbbf9" />
Fuel trim analysis (STFT + LTFT)
MAF airflow validation
O2 sensor switching behavior
Catalyst efficiency detection
Load vs RPM correlation
🖥️ UI + Visualization Layer
<img width="639" height="1160" alt="Screenshot 2026-04-15 013450" src="https://github.com/user-attachments/assets/78cf443d-7190-4bbf-b43c-4c6c369eaba7" />
Clean, real-time UI
Highlighted diagnostic insights
Interactive data views
🏗️ System Architecture
<img width="1919" height="1142" alt="Screenshot 2026-04-14 235846" src="https://github.com/user-attachments/assets/18c2a773-473a-4fa0-9e3c-8ab517b7e3d0" />
Frontend (Vite React / Electron)
        ↓
Backend API (Node.js + Express)
        ↓
OBD2 Communication Layer
        ↓
Vehicle ECU (Bluetooth / Serial)

Additional services:

Redis → live streaming
MongoDB → session storage
Python → analysis + visualization
🧠 AI Agent Interface
<img width="1060" height="1068" alt="Screenshot 2026-04-10 143117" src="https://github.com/user-attachments/assets/680a6426-354f-41f2-9ec1-753ccbecec53" />
Text-based diagnostic agent
Voice-based real-time assistant
Same capabilities across both interfaces
🔌 Hardware Integration
<img width="1901" height="1143" alt="image" src="https://github.com/user-attachments/assets/7a92ddaa-dbb8-4010-93a1-9dac70937b70" />

Supports:

ELM327 adapters (low-cost)
OBDLink MX+ (advanced)

Connection methods:

Web Bluetooth (browser)
Serial COM (desktop/Electron)
🐳 Quick Start (Docker)
<img width="1912" height="1053" alt="image" src="https://github.com/user-attachments/assets/8e7eeb1c-b5a3-4405-b04e-f923bfd948b5" />
Pull the backend image
docker pull robertsloan2023mit/backend-uds
Run the system
docker run -d \
  -p 5000:5000 \
  -p 5005:5005 \
  --name tars-backend \
  robertsloan2023mit/backend-uds
🌐 Access the App
<img width="1897" height="1131" alt="image" src="https://github.com/user-attachments/assets/4589d11a-a447-407d-8797-8ef40e9559f1" />

👉 https://asktarsai.com/signup

Test account:

Email: testing6@aol.com  
Password: testing
👨‍🔧 About

TARS was designed and built by a former automotive technician turned software engineer, and tested on real vehicles in a real shop environment.

It’s not just a scan tool — it’s a diagnostic partner.

🚧 Roadmap
UDS actuator control (bi-directional commands)
Manufacturer-specific Mode 06 decoding
ML-based fault classification
Autonomous diagnostic loops
Mobile apps (iOS / Android)
⚠️ Disclaimer

This system is intended for diagnostic assistance only.
Always verify repairs using proper service procedures.
