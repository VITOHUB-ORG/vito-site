# VitoTech Website - Containerized Deployment

This project contains the VitoTech website with both frontend (React + Vite) and backend (Django) containerized using Docker, with a complete CI/CD pipeline using Jenkins.

## 🚀 Quick Start

### Local Development

1. **Backend (Django)**
```bash
cd VitoTechWebsiteBackend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. **Frontend (React)**
```bash
cd VitoTechWebsiteFrontend
npm install
npm run dev
```

### Docker Deployment

1. **Build and Run Locally**
```bash
docker-compose up -d --build
```

2. **Access the Application**
- Frontend: http://localhost:8081
- Backend API: http://localhost:8000

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Server                        │
│                   (206.189.112.134)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Port 80    → Nginx (smartmtn.co.tz - Original System)      │
│  Port 8000  → Django Backend (vito_backend)                  │
│  Port 8081  → React Frontend (vito_frontend via Nginx)       │
│  Port 8082  → Jenkins CI/CD Server                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Project Structure

```
vito/
├── VitoTechWebsiteBackend/          # Django Backend
│   ├── Dockerfile                    # Backend container config
│   ├── requirements.txt              # Python dependencies
│   ├── manage.py
│   └── ...
├── VitoTechWebsiteFrontend/         # React Frontend
│   ├── Dockerfile                    # Frontend container config (Multi-stage)
│   ├── nginx.conf                    # Nginx configuration for serving
│   ├── package.json
│   └── ...
├── docker-compose.yml               # Main application orchestration
├── docker-compose.jenkins.yml       # Jenkins server configuration
├── Jenkinsfile                      # CI/CD pipeline definition
└── .agent/workflows/                # Deployment workflows
    ├── deploy.md                    # Deployment guide
    └── jenkins-setup.md             # Jenkins configuration guide
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
- Located at: `VitoTechWebsiteBackend/.env`
- Contains: Django settings, database config, email settings, etc.

**Frontend (.env)**
- Located at: `VitoTechWebsiteFrontend/.env`
- Contains: API base URL

### Docker Compose Services

**Main Application (docker-compose.yml)**
- `backend`: Django application (Port 8000)
- `frontend`: React app served by Nginx (Port 8081)

**Jenkins (docker-compose.jenkins.yml)**
- `jenkins`: CI/CD server (Port 8082)

## 🚢 Deployment

### Manual Deployment

```bash
# Sync code to server
rsync -avz --exclude 'node_modules' --exclude 'venv' --exclude '.git' ./ root@206.189.112.134:/root/vito

# Deploy on server
ssh root@206.189.112.134 "cd /root/vito && docker-compose down && docker-compose up -d --build"
```

### Automated Deployment (Jenkins)

1. **Access Jenkins**: http://206.189.112.134:8082
2. **Configure Pipeline**: See `.agent/workflows/jenkins-setup.md`
3. **Push to Git**: Pipeline auto-deploys on push (if webhook configured)

## 🔐 Credentials & Access

### Server Access
- **IP**: 206.189.112.134
- **User**: root
- **SSH**: Passwordless (key-based authentication configured)

### Application URLs
- **Frontend**: http://206.189.112.134:8081
- **Backend API**: http://206.189.112.134:8000
- **Jenkins**: http://206.189.112.134:8082
- **Original System**: http://206.189.112.134 (smartmtn.co.tz)

### Jenkins
- **Initial Password**: Run `ssh root@206.189.112.134 "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"`

## 📝 Workflows

Detailed workflows are available in `.agent/workflows/`:

1. **deploy.md**: Step-by-step deployment guide
2. **jenkins-setup.md**: Complete Jenkins configuration guide

## 🛠️ Troubleshooting

### Check Container Status
```bash
ssh root@206.189.112.134 "docker ps"
```

### View Logs
```bash
# Backend logs
ssh root@206.189.112.134 "docker logs vito_backend --tail 100"

# Frontend logs
ssh root@206.189.112.134 "docker logs vito_frontend --tail 100"

# Jenkins logs
ssh root@206.189.112.134 "docker logs jenkins --tail 100"
```

### Restart Services
```bash
ssh root@206.189.112.134 "cd /root/vito && docker-compose restart"
```

### Full Rebuild
```bash
ssh root@206.189.112.134 "cd /root/vito && docker-compose down && docker-compose up -d --build --force-recreate"
```

## 🔄 CI/CD Pipeline

The Jenkins pipeline automatically:
1. ✅ Builds Docker images for backend and frontend
2. ✅ Pushes images to Docker Hub
3. ✅ Deploys to production server via SSH
4. ✅ Restarts containers with new images

## 📚 Technology Stack

### Backend
- Python 3.11
- Django 5.2.8
- Django REST Framework
- Gunicorn (Production Server)
- SQLite (Database)

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Nginx (Production Server)

### DevOps
- Docker & Docker Compose
- Jenkins
- Nginx (Reverse Proxy)

## 🎯 Next Steps

1. ✅ Set up Jenkins credentials (Docker Hub)
2. ✅ Push code to Git repository
3. ✅ Configure Jenkins pipeline
4. ✅ Set up webhook for auto-deployment
5. ⏳ Configure domain name (vitohub.org) to point to server
6. ⏳ Set up SSL/HTTPS with Let's Encrypt

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributors here]
