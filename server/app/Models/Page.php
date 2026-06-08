<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'type',
        'slug',
        'is_featured',
        'image',
        'title_ro',
        'title_ru',
        'content_ro',
        'content_ru',
        'contact_list',
    ];

    protected $casts = [
        'contact_list' => 'array'
    ];
}
