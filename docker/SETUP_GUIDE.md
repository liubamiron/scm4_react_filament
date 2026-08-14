# Docker Setup Guide

## Architecture

```
Browser (localhost:5173)
    ↓
React Client (5173)
    ↓
    └─→ Main Website: http://localhost:8000
    └─→ API: http://localhost:8000/api
    └─→ Admin Panel: http://localhost:8000/admin

Nginx (container port 80, published on the host as 8000)
    ├─→ localhost → Laravel (with Filament admin at /admin)
    ├─→ api.localhost → same Laravel app, kept for the subdomain layout
    └─→ /storage → Static files

PHP-FPM (app:9000)
    └─→ Handles all PHP requests

MySQL (3306)
    └─→ Database
```

## Setup Instructions

### 1. Add to /etc/hosts (for local development)

```bash
127.0.0.1 localhost
127.0.0.1 api.localhost
```

On Windows, edit: `C:\Windows\System32\drivers\etc\hosts`
On Mac/Linux, edit: `/etc/hosts`

### 2. Set your user id

`server/` is bind-mounted, so it keeps host ownership inside the container.
Copy `docker/.env.example` to `docker/.env` and put your own ids in it:

```bash
cd docker
cp .env.example .env
printf 'APP_UID=%s\nAPP_GID=%s\n' "$(id -u)" "$(id -g)" > .env
```

Without this, PHP runs as `www-data` (uid 82), cannot write `storage/` or
`bootstrap/cache`, and Laravel quietly writes to the system temp dir instead.

### 3. Start Docker

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 4. Initial Setup

```bash
# SSH into the app container
docker-compose -f docker/docker-compose.yml exec app sh

# Run migrations
php artisan migrate

# Create storage symlink
php artisan storage:link

# Exit container
exit
```

## Access Points

- **Main Website**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API**: http://localhost:8000/api (also reachable at http://api.localhost:8000/api)
- **React Dev Server**: http://localhost:5173
- **Database**: localhost:3306 (root/root)

## File Structure

```
docker/
├── docker-compose.yml    # Docker services configuration
├── nginx.conf           # Nginx virtual hosts config
├── DOCKER_README.md     # This file
server/
├── Dockerfile           # Original: php:8.3-fpm-alpine with artisan serve
├── Dockerfile.fpm       # New: php:8.3-fpm for Nginx
client/
├── Dockerfile.dev       # React dev server
├── .env                 # VITE_API_URL / VITE_STORAGE_URL for running outside Docker
```

Inside Docker the two `VITE_*` values come from `docker-compose.yml` instead — a
real env var wins over the `.env` file. Both must point at the host-published
port (8000), because the browser resolves them, not the compose network.

## Stop Docker

```bash
docker-compose -f docker/docker-compose.yml down
```

## Troubleshooting

### API requests failing with CORS
- Check that api.localhost is in your hosts file
- Verify CORS config allows the React origin

### Images not loading
- Images stored in `/storage/tinymce/` via the upload endpoint
- Ensure storage symlink is created: `php artisan storage:link`
- Check `VITE_STORAGE_URL` includes the `:8000` port — without it the browser
  requests port 80, where nothing is listening

### `tempnam(): file created in the system's temporary directory`
PHP in the container cannot write `storage/` or `bootstrap/cache`, so Laravel
falls back to `/tmp`. Set `APP_UID`/`APP_GID` in `docker/.env` to your own
`id -u` / `id -g` and recreate the app container. Verify with:

```bash
docker compose exec app id          # should print your uid, not 82
docker compose exec app touch storage/framework/views/.probe && echo writable
```

### Database connection errors
- Ensure MySQL container is running: `docker-compose -f docker/docker-compose.yml ps`
- Check database credentials in .env match docker-compose.yml
