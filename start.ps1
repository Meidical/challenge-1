# Build Docker images (use forward slashes)
docker build -f ./Prolog/Dockerfile -t prolog:latest ./Prolog/
docker build -f ./Java/challenge1/Dockerfile -t drools:latest ./Java/challenge1/
docker build -f ./Interface/Dockerfile -t interface:latest ./Interface/

# Stop running containers if present
docker-compose down

# Start containers
docker-compose up -d

# Open Chrome at localhost:3000 with custom flags (Windows)
Start-Process -FilePath "chrome.exe" -ArgumentList "--user-data-dir=C:\Chrome dev session", "--disable-web-security", "http://localhost:3000"