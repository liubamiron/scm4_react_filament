<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TinyMceUploadController extends Controller
{
    // Content column is ~900px wide; 1600 keeps images sharp on retina screens.
    private const MAX_SIDE = 1600;

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:5120',
        ]);

        $file = $request->file('file');
        $path = $file->store('tinymce', 'public');

        $this->downscale(Storage::disk('public')->path($path), $file);

        return response()->json([
                    'location' => asset('storage/' . $path),
                ]);
    }

    /**
     * Shrinks an oversized image in place, keeping its format. Anything GD
     * can't read (or a server without GD) is left exactly as uploaded.
     */
    private function downscale(string $fullPath, UploadedFile $file): void
    {
        if (! extension_loaded('gd')) {
            return;
        }

        [$width, $height] = @getimagesize($fullPath) ?: [0, 0];

        if (max($width, $height) <= self::MAX_SIDE) {
            return;
        }

        [$read, $write] = match ($file->getMimeType()) {
            'image/jpeg' => ['imagecreatefromjpeg', fn ($img) => imagejpeg($img, $fullPath, 82)],
            'image/png' => ['imagecreatefrompng', fn ($img) => imagepng($img, $fullPath, 8)],
            'image/webp' => ['imagecreatefromwebp', fn ($img) => imagewebp($img, $fullPath, 82)],
            default => [null, null],
        };

        if (! $read || ! function_exists($read) || ! ($source = @$read($fullPath))) {
            return;
        }

        // Re-encoding drops EXIF, so a phone photo would lose its rotation flag
        // and come out sideways — bake the rotation into the pixels first.
        $orientation = function_exists('exif_read_data')
            ? (@exif_read_data($fullPath)['Orientation'] ?? 1)
            : 1;
        $angle = [3 => 180, 6 => -90, 8 => 90][$orientation] ?? 0;

        if ($angle !== 0 && ($rotated = imagerotate($source, $angle, 0))) {
            $source = $rotated;
            [$width, $height] = [imagesx($source), imagesy($source)];
        }

        $scale = self::MAX_SIDE / max($width, $height);
        $resized = imagescale($source, (int) round($width * $scale), (int) round($height * $scale));

        if ($resized) {
            // Keep transparency in PNG/WebP.
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            $write($resized);
        }
    }
}
