DOCKER.md
🚀 Quick Start (One Command Run)

Pull and run the full backend system (Node server + databases):

docker pull robertsloan2023mit/backend-uds
docker run -d -p 5000:5000 -p 27018:27017 -p 5432:5432 --name backend-uds robertsloan2023mit/backend-uds
📦 What This Container Includes

This Docker image contains a fully preconfigured backend environment:

Node.js API Server
MongoDB (session storage, recordings)
PostgreSQL + pgvector (embeddings / memory)
Preconfigured services and internal networking
🌐 Port Mappings
Service	Container Port	Host Port
Node Backend	5000	5000
MongoDB	27017	27018
PostgreSQL	5432	5432
🧠 Usage

Once running, your backend will be available at:

http://localhost:5000

Example endpoints:

/api/obd2/*
/api/agent/*
/api/realtime/*
🛑 Stopping the Container
docker stop backend-uds
docker rm backend-uds
🔄 Updating to Latest Version
docker pull robertsloan2023mit/backend-uds
docker stop backend-uds
docker rm backend-uds
docker run -d -p 5000:5000 -p 27018:27017 -p 5432:5432 --name backend-uds robertsloan2023mit/backend-uds
💾 Persistent Data (Optional but Recommended)

To persist database data across container restarts:

docker run -d \
  -p 5000:5000 \
  -p 27018:27017 \
  -p 5432:5432 \
  -v backend_mongo:/data/db \
  -v backend_pg:/var/lib/postgresql/data \
  --name backend-uds \
  robertsloan2023mit/backend-uds
🔍 Logs
docker logs -f backend-uds
⚙️ Notes
Designed for quick deployment and testing
Suitable for local dev, staging, or controlled production use
Ensure ports are not already in use on your machine
Works with frontend hosted locally or remotely (e.g., Vercel)
🧩 Integration

Your frontend can connect directly to:

http://localhost:5000

If running remotely, replace with your server IP or domain.

🛠️ Troubleshooting
Port already in use

Change host ports:

-p 5001:5000
Container not starting

Check logs:

docker logs backend-uds
Database connection issues

Make sure:

Mongo → port 27018
Postgres → port 5432
📌 Summary

With a single command, this container provides:

Full backend API
Databases preconfigured
Ready-to-use diagnostic system backend
