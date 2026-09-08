# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Public website for IMSP Spitalul Clinic Municipal Nr.4 (Chișinău). Two independent
apps in one repo:

- `server/` — Laravel 13 + Filament 4 admin panel. Serves a read-only JSON API and
  the `/admin` CMS. PHP 8.3, MySQL.
- `client/` — React 19 + Vite + TanStack Router SPA that consumes that API.

They talk over HTTP only (`VITE_API_URL`), never share code, and are developed and
built separately.

## Commands

### Client (`client/`)

```bash
npm run dev        # Vite dev server on :5173
npm run build      # tsc -b && vite build
npm run lint       # eslint .
```

There is no test setup in the client.

### Server (`server/`)

```bash
php artisan serve                        # :8000
composer test                            # config:clear + artisan test
php artisan test --filter=ExampleTest    # single test (PHPUnit, sqlite :memory:)
php artisan migrate
php artisan storage:link                 # required for uploaded images to resolve
vendor/bin/pint                          # formatter
```

`composer dev` runs server + queue + `pail` logs + vite concurrently.

### Docker (full stack)

```bash
docker compose -f docker/docker-compose.yml up -d
docker compose -f docker/docker-compose.yml exec app sh   # artisan lives here
```

Before the first run, write your own uid/gid into `docker/.env`
(`printf 'APP_UID=%s\nAPP_GID=%s\n' "$(id -u)" "$(id -g)" > docker/.env`) — the
`server/` bind mount keeps host ownership, and without this PHP cannot write
`storage/` and silently falls back to the system temp dir. See
`docker/SETUP_GUIDE.md` for the full architecture and troubleshooting.

Access points: site/API/admin on `:8000`, React dev server on `:5173`.

## Architecture

### Content model: one column per language

The database is **not** using a translations table. Every translatable field is a
pair of columns suffixed with the locale — `title_ro`/`title_ru`,
`content_ro`/`content_ru`, `name_ro`/`name_ru`. The `_ru` columns are nullable.

On the client, never read `record.title` — read it through
`localized(record, 'title', locale)` (`client/src/i18n/content.ts`), which falls
back to the `_ro` value when the translation is missing. In Filament, each
resource form wraps the RO/RU fields in a `Tabs` component (see
`ServiceForm.php`, `PageResource.php`).

Adding a language means: a migration adding `*_<locale>` columns, a new tab in
every Filament form, a new entry in `SUPPORTED_LOCALES`, and a new message map in
`client/src/i18n/ui.ts`.

### i18n and routing: the URL is the source of truth

Every page lives under the `/$lang` route segment. There is no language store —
`useLocale()` reads the `lang` param (falling back to parsing `location.pathname`
for components rendered above `$lang`, like the header). `/` redirects to the
resolved locale (localStorage → browser language → `ro`); a bare path like
`/about` is redirected to `/ro/about` by `$lang.tsx`'s `beforeLoad`.

Two distinct translation sources, don't mix them:
- `useT()` / `client/src/i18n/ui.ts` — static chrome (nav labels, loading states).
  Keys only, never content.
- `localized()` — anything editable in the admin panel, coming from the API.

Routes are file-based under `client/src/routes/`; `routeTree.gen.ts` is generated
by the TanStack router Vite plugin — never edit it by hand. Route files stay thin
and delegate to a component in `client/src/pages/`.

### Data fetching

`apiClient<T>(endpoint)` (`client/src/api/client.ts`) wraps `fetch` against
`VITE_API_URL`. Each resource has a TanStack Query hook in
`client/src/features/pages/hook/` with a 5-minute `staleTime`. Queries are
locale-independent — the API returns both languages in one payload and the
component picks the right column, so switching language never refetches.

Content bodies are HTML produced by TinyMCE in the admin panel and rendered with
`dangerouslySetInnerHTML`. They contain relative `../storage/...` image paths, so
run them through `transformImageUrls()` first to rewrite them against
`VITE_STORAGE_URL`.

### API

All endpoints are closures in `server/routes/api.php` returning Eloquent models
directly (no controllers, no API resources — the JSON shape *is* the table
schema, so a migration renaming a column breaks the client types in
`client/src/types/index.ts`). `/events` deliberately selects a column subset and
omits `content_*`; the detail endpoint returns the full row. Lookups are by
`slug`, not id.

CORS is wide open (`allowed_origins: ['*']`) and nothing is authenticated except
the unused `/user` route.

### Admin panel

Filament auto-discovers resources under `server/app/Filament/Resources/`. Rich
text uses a custom `TinyMceEditor` field (`app/Filament/Forms/Components/`) backed
by a Blade view that loads TinyMCE from the CDN and posts images to
`POST /admin/tinymce/upload` (`TinyMceUploadController`, stores to the `public`
disk under `tinymce/`).

`Page` is the catch-all content model, discriminated by a `type` enum
(`general`, `about`, `service`, `section`, `partnership`, `contact`) that drives
which form sections are visible and which pages a record shows up on. Some client
pages special-case the slug (e.g. `DinamicPage` renders `ContactPage` for
`slug === 'contacte'`), so slugs are load-bearing. `contact_list` on `Page` is a
Filament repeater cast to `array` and is intentionally untranslated.

## Conventions

- UI copy is Romanian first, Russian second; admin panel labels are written in
  Romanian/Russian.
- Client imports may use the `@/` alias for `client/src`.
- `Service` (own table) and `Page` with `type = 'service'` are different things
  that coexist; check which one an endpoint or resource means before editing.
