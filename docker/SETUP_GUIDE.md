# Docker Setup Guide

## Architecture

```
Browser (localhost:5173 or 5173)
    ↓
React Client (5173)
    ↓
    └─→ Main Website: http://localhost
    └─→ API: http://api.localhost/api
    └─→ Admin Panel: http://localhost/admin

Nginx (localhost:80)
    ├─→ api.localhost → Laravel API
    ├─→ localhost → Laravel (with Filament admin at /admin)
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

### 2. Start Docker

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 3. Initial Setup

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

- **Main Website**: http://localhost
- **Admin Panel**: http://localhost/admin
- **API**: http://api.localhost/api
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
├── .env                 # VITE_API_URL=http://api.localhost/api
```

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

### Database connection errors
- Ensure MySQL container is running: `docker-compose -f docker/docker-compose.yml ps`
- Check database credentials in .env match docker-compose.yml
