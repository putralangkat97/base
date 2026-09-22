<?php

namespace App\Http\Requests\Vowly;

use App\Models\Design;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UploadDesignMediaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $design = $this->route('design');

        abort_unless($design instanceof Design, 404);

        return Gate::allows('uploadMedia', $design);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'extensions:jpg,jpeg,png,webp',
                'max:10240',
                Rule::dimensions()->maxWidth(6000)->maxHeight(6000),
            ],
        ];
    }
}
