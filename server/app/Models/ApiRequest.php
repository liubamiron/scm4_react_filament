<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;

// One row per public API call, written by LogApiRequest. Not activity-logged:
// it is itself a log, and far too busy.
class ApiRequest extends Model
{
    use MassPrunable;

    public const UPDATED_AT = null;

    protected $fillable = ['ip', 'method', 'path', 'status', 'user_agent'];

    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subDays(90));
    }
}
