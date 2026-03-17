<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ThesisController extends Controller
{
    public function index()
    {
        $theses = Thesis::with(['owner', 'primarySupervisor'])->latest()->get();
        return response()->json($theses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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
            'doi' => 'nullable|string|max:255',
            'co_author' => 'nullable|string|max:255',
            'panelists' => 'nullable|string|max:255',
            'review_checklist' => 'nullable|array',
            'recommended_by' => 'nullable|string|max:255',
            'archived_by' => 'nullable|string|max:255',
        ]);

        $validated['owner_id'] = $request->user()->id;

        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');
            $path = $file->store('theses/pdfs', 'public');
            $validated['pdf_path'] = $path;
            $validated['pdf_original_name'] = $file->getClientOriginalName();
        }

        unset($validated['pdf_file']);

        $thesis = Thesis::create($validated);

        return response()->json([
            'message' => 'Thesis created successfully',
            'thesis' => $thesis->load(['owner', 'primarySupervisor'])
        ], 201);
    }

    public function update(Request $request, Thesis $thesis)
    {
        $validated = $request->validate([
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
            'doi' => 'nullable|string|max:255',
            'co_author' => 'nullable|string|max:255',
            'panelists' => 'nullable|string|max:255',
            'review_checklist' => 'nullable|array',
            'recommended_by' => 'nullable|string|max:255',
            'archived_by' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('pdf_file')) {
            if ($thesis->pdf_path) {
                Storage::disk('public')->delete($thesis->pdf_path);
            }
            $file = $request->file('pdf_file');
            $path = $file->store('theses/pdfs', 'public');
            $validated['pdf_path'] = $path;
            $validated['pdf_original_name'] = $file->getClientOriginalName();
        }

        unset($validated['pdf_file']);

        $thesis->update($validated);

        return response()->json([
            'message' => 'Thesis updated successfully',
            'thesis' => $thesis->load(['owner', 'primarySupervisor'])
        ]);
    }

    public function review(Request $request, Thesis $thesis)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['accepted', 'rejected'])],
            'remarks' => 'nullable|string',
            'review_checklist' => 'nullable|array',
            'recommended_by' => 'nullable|string|max:255',
            'archived_by' => 'nullable|string|max:255',
        ]);

        $thesis->update([
            'status' => $validated['status'],
            'review_checklist' => $validated['review_checklist'] ?? $thesis->review_checklist,
            'recommended_by' => $validated['recommended_by'] ?? $thesis->recommended_by,
            'archived_by' => $validated['archived_by'] ?? $thesis->archived_by,
        ]);

        return response()->json([
            'message' => 'Thesis status updated to ' . $validated['status'],
            'thesis' => $thesis->fresh()->load(['owner', 'primarySupervisor'])
        ]);
    }

    public function destroy(Thesis $thesis)
    {
        if ($thesis->pdf_path) {
            Storage::disk('public')->delete($thesis->pdf_path);
        }
        $thesis->delete();
        return response()->json(['message' => 'Thesis deleted successfully']);
    }
}
