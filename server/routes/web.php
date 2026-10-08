<?php

use App\Http\Controllers\TinyMceUploadController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/admin/tinymce/upload', [TinyMceUploadController::class, 'upload'])
    ->name('tinymce.upload');

Route::post('/admin/tinymce/upload-file', [TinyMceUploadController::class, 'uploadFile'])
    ->middleware('auth')
    ->name('tinymce.upload-file');
