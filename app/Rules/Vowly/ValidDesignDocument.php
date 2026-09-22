<?php

namespace App\Rules\Vowly;

use App\Support\Vowly\DesignDocumentSchema;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDesignDocument implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        foreach (DesignDocumentSchema::validate($value) as $path => $messages) {
            foreach ($messages as $message) {
                $fail($path.': '.$message);
            }
        }
    }
}
