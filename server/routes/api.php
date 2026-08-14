<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Event;
use App\Models\Page;
use App\Models\Partner;
use App\Models\TransparencyCategory;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// In production use subdomain, in local dev allow both
$domain = (app()->isProduction()) ? 'api.your-domain.com' : null;

if ($domain && app()->isProduction()) {
    Route::domain($domain)->group(function () {
        registerApiRoutes();
    });
} else {
    registerApiRoutes();
}

function registerApiRoutes() {
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/pages/{slug}', function ($slug) {
        return Page::where('slug', $slug)->firstOrFail();
    });

    Route::get('/pages', function () {
        return Page::all();
    });

    Route::get('/partners', function () {
        return Partner::all();
    });

    // The list omits `content` — the cards only need the summary, and the full
    // article is fetched per event on the detail page.
    Route::get('/events', function () {
        return Event::orderBy('date', 'desc')->get([
            'id',
            'slug',
            'title_ro',
            'title_ru',
            'description_ro',
            'description_ru',
            'date',
            'image',
        ]);
    });

    Route::get('/events/{slug}', function ($slug) {
        return Event::where('slug', $slug)->firstOrFail();
    });

    Route::get('/transparency', function () {
        return TransparencyCategory::with(['documents' => function ($query) {
            $query->where('is_active', true);
        }])
        ->orderBy('sort_order', 'asc')
        ->get();
    });
}
