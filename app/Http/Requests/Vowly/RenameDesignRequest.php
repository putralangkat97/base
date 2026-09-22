<?php

namespace App\Http\Requests\Vowly;

use App\Models\Design;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class RenameDesignRequest extends FormRequest
{
    /**
     * Determine whether the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('update', $this->design());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $design = $this->design();

        return [
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('designs', 'name')
                    ->where(fn (Builder $query) => $query->where('invitation_id', $design->invitation_id))
                    ->ignore($design),
            ],
        ];
    }

    /**
     * Get the route design.
     */
    private function design(): Design
    {
        $design = $this->route('design');

        abort_unless($design instanceof Design, 404);

        return $design;
    }
}
