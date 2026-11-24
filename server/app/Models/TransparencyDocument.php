<?php

namespace App\Models;

use App\Models\Concerns\LogsChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransparencyDocument extends Model
{
    use LogsChanges;

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
