<?php

namespace App\Http\Requests\Vowly;

use App\Models\Invitation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class CreateDesignRequest extends FormRequest
{
    /**
     * Determine whether the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('update', $this->invitation());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $invitation = $this->invitation();

        return [
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('designs', 'name')
                    ->where(fn (Builder $query) => $query->where('invitation_id', $invitation->id)),
            ],
        ];
    }

    /**
     * Get the route invitation.
     */
    private function invitation(): Invitation
    {
        $invitation = $this->route('invitation');

        abort_unless($invitation instanceof Invitation, 404);

        return $invitation;
    }
}
