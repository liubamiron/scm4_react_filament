<?php

namespace App\Models;

use App\Models\Concerns\LogsChanges;
use Illuminate\Database\Eloquent\Model;

class LawDocument extends Model
{
    use LogsChanges;

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
