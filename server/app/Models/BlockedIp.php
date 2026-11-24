<?php

namespace App\Models;

use App\Models\Concerns\LogsChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class BlockedIp extends Model
{
    use LogsChanges;

    private const CACHE_KEY = 'blocked_ips';

    protected $fillable = ['ip', 'reason'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /** Checked on every API request, so the list is cached until it changes. */
    public static function isBlocked(?string $ip): bool
    {
        if ($ip === null) {
            return false;
        }

        $ips = Cache::rememberForever(self::CACHE_KEY, fn () => static::pluck('ip')->flip()->all());

        return isset($ips[$ip]);
    }
}
