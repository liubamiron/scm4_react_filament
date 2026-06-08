<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransparencyCategory extends Model
{
    // Add this property:
    protected $fillable = [
        'name_ro',
        'name_ru',
        'slug',
        'sort_order',
    ];

    /**
     * Relationship to the documents
     */
 public function documents(): HasMany
 {
     return $this->hasMany(TransparencyDocument::class)->where('is_active', true);
 }
}
