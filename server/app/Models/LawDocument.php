<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LawDocument extends Model
{
    protected $fillable = [
        'title_ro',
        'title_ru',
        'file_path',
        'url',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
