<?php

namespace App\Actions\Vowly;

use App\Models\Design;
use App\Support\Vowly\DesignDocumentSchema;

class SaveDesignDocument
{
    /**
     * Validate and persist an active Design document.
     *
     * @param  array<string, mixed>  $document
     */
    public function handle(Design $design, array $document): Design
    {
        $design->update([
            'document' => DesignDocumentSchema::assertValid($document),
        ]);

        return $design->refresh();
    }
}
