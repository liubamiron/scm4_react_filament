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

// The API is served from whatever host the app is deployed on — the same
// origin as the client in the current layout. Binding these routes to a
// hard-coded domain would make them unreachable everywhere else, so don't.

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/pages/{slug}', function ($slug) {
    return Page::where('slug', $slug)->firstOrFail();
});

// `?featured=1` narrows the list to the home-page cards. Without it every page
// comes back with its full HTML body, which is far more than the home page needs.
Route::get('/pages', function (Request $request) {
    $query = Page::query();

    if ($request->boolean('featured')) {
        $query->where('is_featured', true);
    }

    return $query->get();
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
