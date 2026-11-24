<?php

namespace App\Models;

use App\Models\Concerns\LogsChanges;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;

class ContactMessage extends Model
{
    use LogsChanges;

    protected $fillable = [
        'name',
        'email',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    // Messages hold visitors' personal data — keep it out of the activity log
    // and record only that a message was read / deleted.
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['is_read'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
