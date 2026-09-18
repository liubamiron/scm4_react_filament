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
        'show_in_header',
        'show_in_footer',
        'title_ro',
        'title_ru',
        'content_ro',
        'content_ru',
        'contact_list',
    ];

    protected $casts = [
        'contact_list' => 'array',
        'show_in_header' => 'boolean',
        'show_in_footer' => 'boolean',
    ];
}
