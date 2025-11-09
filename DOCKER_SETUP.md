# Docker Setup Guide for MotoManiacs

This guide provides step-by-step instructions for running the MotoManiacs application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- A Firebase project configured (see main README.md for Firebase setup)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd motomaniacs
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
GEMINI_API_KEY=your-gemini-api-key-here
```

**Important:** Replace all placeholder values with your actual Firebase configuration values from the Firebase Console.

### 3. Build and Run

```bash
docker-compose up -d
```

This will:
- Build the Docker image (first time only)
- Start the container in detached mode
- Make the app available at `http://localhost:3000`

### 4. Verify the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Common Commands

### Start the Container
```bash
docker-compose up -d
```

### Stop the Container
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### Stop and Remove Everything
```bash
docker-compose down -v
```

## Project Structure

```
motomaniacs/
├── Dockerfile              # Multi-stage Docker build configuration
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf             # Nginx server configuration
├── .dockerignore          # Files to exclude from Docker build
├── .env                   # Environment variables (create this)
└── ...                    # Application source files
```

## How It Works

### Build Process

1. **Stage 1 (Builder):**
   - Uses Node.js 20 Alpine image
   - Installs npm dependencies
   - Builds the React application with Vite
   - Environment variables are injected at build time

2. **Stage 2 (Production):**
   - Uses Nginx Alpine image
   - Copies built static files from Stage 1
   - Configures Nginx to serve the SPA
   - Exposes port 80

### Runtime

- Container runs Nginx web server
- Serves static files from `/usr/share/nginx/html`
- Health check endpoint available at `/health`
- Automatic restart on failure

## Environment Variables

All environment variables starting with `VITE_` are embedded into the application during the build process. This means:

- ✅ Variables are secure (not exposed in runtime)
- ⚠️ You must rebuild the image when changing environment variables

To update environment variables:
1. Edit the `.env` file
2. Rebuild: `docker-compose up -d --build`

## Port Configuration

By default, the application runs on port **3000**. To change the port:

1. Edit `docker-compose.yml`
2. Change the port mapping:
   ```yaml
   ports:
     - "8080:80"  # Change 3000 to your desired port
   ```
3. Restart: `docker-compose down && docker-compose up -d`

## Troubleshooting

### Port Already in Use
**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:** Change the port in `docker-compose.yml` or stop the service using port 3000.

### Build Fails
**Error:** Build process fails with environment variable errors

**Solution:** 
- Ensure all required environment variables are set in `.env`
- Check that values don't have quotes around them
- Verify Firebase configuration values are correct

### Container Won't Start
**Error:** Container exits immediately

**Solution:**
```bash
# Check logs
docker-compose logs

# Check container status
docker-compose ps
```

### Changes Not Reflecting
**Problem:** Code changes don't appear in the running container

**Solution:** 
- Rebuild the container: `docker-compose up -d --build`
- Clear Docker cache if needed: `docker-compose build --no-cache`

### Health Check Fails
**Problem:** Container shows as unhealthy

**Solution:**
- Check if Nginx is running: `docker-compose exec motomaniacs ps aux`
- Check Nginx logs: `docker-compose logs motomaniacs`
- Verify health endpoint: `curl http://localhost:3000/health`

## Running on Different Devices

### Requirements on Target Device
1. Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
2. Network access (for Firebase)
3. Port 3000 available (or change port mapping)

### Steps
1. Copy the entire project directory to the target device
2. Create `.env` file with Firebase configuration
3. Run: `docker-compose up -d`
4. Access at `http://localhost:3000`

### Network Access
To access from other devices on the same network:
- Replace `localhost` with the device's IP address
- Example: `http://192.168.1.100:3000`
- Ensure firewall allows incoming connections on port 3000

## Production Considerations

For production deployment:

1. **Use a reverse proxy** (e.g., Nginx, Traefik) in front of the container
2. **Enable HTTPS** using SSL certificates
3. **Set up proper logging** and monitoring
4. **Configure resource limits** in `docker-compose.yml`:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```
5. **Use Docker secrets** for sensitive environment variables
6. **Set up automated backups** for Firebase data
7. **Monitor container health** and set up alerts

## Support

For issues or questions:
1. Check the main README.md for Firebase setup
2. Review Docker logs: `docker-compose logs -f`
3. Verify environment variables are correctly set
4. Check Firebase Console for configuration issues

