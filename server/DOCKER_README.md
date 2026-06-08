# Laravel Docker Setup

This project now includes Docker support for easy deployment on any computer.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository** (if not already done)

2. **Copy environment file:**
   ```bash
   cp .env .env.docker
   ```

3. **Build and start the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Main app: http://localhost:8000
   - Filament admin: http://localhost:8000/admin

## Development

For development with hot reloading:

```bash
# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Environment Variables

The Docker setup uses the following key environment variables:
- `APP_ENV=production` (or `local` for development)
- `APP_KEY` - Laravel application key
- `DB_CONNECTION=sqlite`
- `DB_DATABASE=/var/www/database/database.sqlite`

## Database

The application uses SQLite by default, which is automatically created and migrated during the Docker build process.

## Building Assets

Frontend assets (React + Tailwind CSS) are built during the Docker image build process using Vite.

## Troubleshooting

- **Port already in use:** Change the port mapping in `docker-compose.yml`
- **Permission issues:** The container runs as `www-data` user
- **Database issues:** SQLite file is created automatically in the container

two options:
Option A — With Docker (recommended, uses your docker-compose.yml):
sudo docker compose up -d
Then open localhost:8000 in the browser. That's it.

Option B — Without Docker (run locally):
Open 2 terminals in your project folder:
Terminal 1:
php artisan serve
Terminal 2:
npm run dev
Then open localhost:8000 in the browser.

DB_CONNECTION=mysql
DB_HOST=mysql (container)
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=password
