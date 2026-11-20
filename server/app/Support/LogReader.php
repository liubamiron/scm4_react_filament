<?php

namespace App\Support;

use Illuminate\Support\Collection;

/**
 * Reads Laravel log files from storage/logs for the admin log viewer.
 * Only the tail of a file is parsed, so a huge log can't exhaust memory.
 */
class LogReader
{
    public const LEVELS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];

    private const TAIL_BYTES = 2 * 1024 * 1024;

    /** @return list<string> file names, newest first */
    public static function files(): array
    {
        $files = glob(storage_path('logs/*.log')) ?: [];
        usort($files, fn ($a, $b) => filemtime($b) <=> filemtime($a));

        return array_map('basename', $files);
    }

    /** Resolves a file name to a path inside storage/logs, or null. */
    public static function path(?string $file): ?string
    {
        // basename() blocks "../" traversal; the name must also be listed.
        if ($file === null || ! in_array(basename($file), self::files(), true)) {
            return null;
        }

        return storage_path('logs/'.basename($file));
    }

    /**
     * Parsed entries, newest first.
     *
     * @return Collection<int, array{date: string, env: string, level: string, message: string, context: string}>
     */
    public static function entries(string $path): Collection
    {
        $size = filesize($path);
        $handle = fopen($path, 'r');
        if ($size > self::TAIL_BYTES) {
            fseek($handle, -self::TAIL_BYTES, SEEK_END);
        }
        $raw = stream_get_contents($handle);
        fclose($handle);

        $parts = preg_split(
            '/^\[(\d{4}-\d{2}-\d{2}[T ][\d:.+\-]+)\] (\w+)\.(\w+): /m',
            $raw,
            -1,
            PREG_SPLIT_DELIM_CAPTURE,
        );

        $entries = [];
        // $parts[0] is whatever precedes the first header (a cut-off entry).
        for ($i = 1; $i + 3 < count($parts) + 1; $i += 4) {
            $body = rtrim($parts[$i + 3] ?? '');
            [$message, $context] = array_pad(explode("\n", $body, 2), 2, '');

            $entries[] = [
                'date' => $parts[$i],
                'env' => $parts[$i + 1],
                'level' => strtolower($parts[$i + 2]),
                'message' => $message,
                'context' => $context,
            ];
        }

        return collect(array_reverse($entries));
    }
}
