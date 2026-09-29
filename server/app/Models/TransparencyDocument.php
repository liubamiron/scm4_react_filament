<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransparencyDocument extends Model
{
    protected $fillable = [
        'transparency_category_id',
        'title_ro',
        'title_ru',
        'file_path',
        'is_active',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(TransparencyCategory::class, 'transparency_category_id');
    }
}
