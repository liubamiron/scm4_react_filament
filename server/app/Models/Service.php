<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_ro',
        'title_ru',
        'excerpt_ro',
        'excerpt_ru',
        'content_ro',
        'content_ru',
        'image',
        'slug',
        'is_active'
    ];

    /**
     * Helper to get the full URL for the image
     */
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : asset('images/default-service.png');
    }
}
