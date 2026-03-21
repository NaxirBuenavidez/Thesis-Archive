<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreThesisRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Simplified for this implementation, typically use $this->user()->can(...)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|min:1',
            'author' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'abstract' => 'nullable|string',
            'discipline' => 'nullable|string',
            'keywords' => 'nullable|array',
            'status' => ['required', 'string', Rule::in(['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'published'])],
            'degree_type' => 'nullable|string',
            'institution' => 'nullable|string',
            'department' => 'nullable|string',
            'submission_date' => 'nullable|date',
            'defense_date' => 'nullable|date',
            'embargo_until' => 'nullable|date',
            'is_confidential' => 'boolean',
            'primary_supervisor_id' => 'nullable|exists:users,id',
            'pdf_file' => 'nullable|file|mimes:pdf|max:51200',
            'doi' => 'nullable|string|max:255|unique:theses,doi',
            'co_author' => 'nullable|string|max:255',
            'panelists' => 'nullable|string|max:255',
            'review_checklist' => 'nullable|array',
            'recommended_by' => 'nullable|string|max:255',
            'archived_by' => 'nullable|string|max:255',
        ];
    }
}
