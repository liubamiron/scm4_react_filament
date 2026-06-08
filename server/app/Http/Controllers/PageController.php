<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show($slug = 'home')
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        return view('page', compact('page'));
    }
}