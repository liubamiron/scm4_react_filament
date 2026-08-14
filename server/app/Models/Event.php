<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
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
        ];

        protected $casts = [
            'date' => 'date',
        ];
}
