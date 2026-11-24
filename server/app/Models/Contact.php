<?php

namespace App\Models;

use App\Models\Concerns\LogsChanges;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use LogsChanges;

    protected $fillable = [
        'sort_order', 'department_ro', 'department_ru',
        'staff_name_ro', 'staff_name_ru', 'position_ro',
        'position_ru', 'phone_numbers',
    ];
}
