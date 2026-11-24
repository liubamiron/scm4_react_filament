<?php

namespace App\Models;

use App\Models\Concerns\LogsChanges;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use LogsChanges;

    protected $fillable = [
        'slug',
        'title_ro',
        'title_ru',
        'description_ro',
        'description_ru',
        'content_ro',
        'content_ru',
        'date',
        'image',
        'is_published',
    ];

    protected $casts = [
        'date' => 'date',
        'is_published' => 'boolean',
    ];
}
