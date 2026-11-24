<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Keeps the admin Activity Log to the last 365 days (config/activitylog.php).
Schedule::command('activitylog:clean')->daily();

// Deletes API request rows older than 90 days (ApiRequest::prunable).
Schedule::command('model:prune')->daily();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
