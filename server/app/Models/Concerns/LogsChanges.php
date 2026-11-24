<?php

namespace App\Models\Concerns;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Records create/update/delete of a model in the activity log shown on the
 * admin "Activity Log" page. Only fields that actually changed are stored;
 * secrets never are.
 */
trait LogsChanges
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logExcept(['password', 'remember_token', 'app_authentication_secret', 'app_authentication_recovery_codes'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
