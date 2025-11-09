# Docker Troubleshooting

## API Version Error Fix

If you see this error:
```
request returned 500 Internal Server Error for API route and version .../v1.51/...
```

### Solution 1: Restart Docker Desktop
1. Quit Docker Desktop completely
2. Restart Docker Desktop
3. Wait for it to fully start
4. Try again: `make dev`

### Solution 2: Use Docker Compose V2 (newer command)
Instead of `docker-compose`, try using `docker compose` (without hyphen):
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Solution 3: Update Docker Desktop
1. Check for updates in Docker Desktop
2. Update to the latest version
3. Restart after updating

### Solution 4: Check Docker Context
Make sure you're using the correct Docker context:
```bash
docker context use desktop-linux
docker context ls
```

### Solution 5: Pull Image Manually First
Try pulling the image manually before running docker-compose:
```bash
docker pull postgres:16-alpine
make dev
```

