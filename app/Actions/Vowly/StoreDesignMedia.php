<?php

namespace App\Actions\Vowly;

use App\Models\Design;
use App\Models\DesignMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class StoreDesignMedia
{
    /**
     * Store a validated image on the private disk and attach its metadata.
     */
    public function handle(Design $design, UploadedFile $photo): DesignMedia
    {
        $disk = 'local';
        $path = $photo->store('designs/'.$design->id, $disk);
        if ($path === false) {
            throw new RuntimeException('Unable to store the uploaded image.');
        }

        $dimensions = getimagesize($photo->getRealPath());

        try {
            return $design->media()->create([
                'disk' => $disk,
                'path' => $path,
                'mime_type' => (string) $photo->getMimeType(),
                'size' => (int) $photo->getSize(),
                'width' => is_array($dimensions) ? $dimensions[0] : null,
                'height' => is_array($dimensions) ? $dimensions[1] : null,
            ]);
        } catch (Throwable $exception) {
            Storage::disk($disk)->delete($path);

            throw $exception;
        }
    }
}
