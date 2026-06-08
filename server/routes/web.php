<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/admin/tinymce/upload', [\App\Http\Controllers\TinyMceUploadController::class, 'upload'])
    ->name('tinymce.upload');

