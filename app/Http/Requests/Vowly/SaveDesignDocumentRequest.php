<?php

namespace App\Http\Requests\Vowly;

use App\Models\Design;
use App\Rules\Vowly\ValidDesignDocument;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class SaveDesignDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('save', $this->design());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document' => ['required', 'array', new ValidDesignDocument],
        ];
    }

    /**
     * Get the route-bound design.
     */
    private function design(): Design
    {
        $design = $this->route('design');

        abort_unless($design instanceof Design, 404);

        return $design;
    }
}
