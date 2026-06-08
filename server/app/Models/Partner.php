<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partner extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Based on your screenshot fields: Name, Logo, Link, Sort order, Is active.
     */
    protected $fillable = [
        'name',
        'logo',
        'link',
        'sort_order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     * This ensures 'is_active' is treated as a true/false boolean.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
