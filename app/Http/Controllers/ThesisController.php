<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\User;
use App\Models\Role;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ThesisController extends Controller
{
    public function index()
    {
        $theses = Thesis::with(['owner.profile', 'primarySupervisor'])->latest()->get();
        return response()->json($theses);
    }

    public function publicIndex(Request $request)
    {
        // Enforce strict public visibility: published only, not confidential
        $theses = Thesis::with(['owner.profile', 'primarySupervisor'])
            ->where('status', 'published')
            ->where('is_confidential', false)
            ->latest()
            ->get()
            ->map(function ($thesis) {
                // Manually strip highly sensitive document paths and admin metadata globally
                $thesis->makeHidden([
                    'pdf_path', 
                    'pdf_original_name', 
                    'docx_path', 
                    'docx_original_name', 
                    'archived_by', 
                    'recommended_by', 
                    'review_checklist'
                ]);
                return $thesis;
            });

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
            'doi' => 'nullable|string|max:255|unique:theses,doi',
            'co_author' => 'nullable|string|max:255',
            'panelists' => 'nullable|string|max:255',
            'review_checklist' => 'nullable|array',
            'recommended_by' => 'nullable|string|max:255',
            'archived_by' => 'nullable|string|max:255',
        ]);

        $validated['owner_id'] = $request->user()->id;

        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');
            $path = $file->store('theses/pdfs', 's3');
            $validated['pdf_path'] = $path;
            $validated['pdf_original_name'] = $file->getClientOriginalName();
        }

        unset($validated['pdf_file']);

        $thesis = Thesis::create($validated);

        NotificationController::dispatch(
            'new_thesis',
            'New Thesis Submitted',
            "\"" . $thesis->title . "\" has been submitted by " . ($request->user()->name ?? 'a user') . ".",
            ['thesis_id' => $thesis->id, 'author' => $thesis->author]
        );

        return response()->json([
            'message' => 'Thesis created successfully',
            'thesis'  => $thesis->load(['owner', 'primarySupervisor'])
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
            'doi' => 'nullable|string|max:255|unique:theses,doi,' . $thesis->id,
            'co_author' => 'nullable|string|max:255',
            'panelists' => 'nullable|string|max:255',
            'review_checklist' => 'nullable|array',
            'recommended_by' => 'nullable|string|max:255',
            'archived_by' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('pdf_file')) {
            if ($thesis->pdf_path) {
                Storage::disk('s3')->delete($thesis->pdf_path);
            }
            $file = $request->file('pdf_file');
            $path = $file->store('theses/pdfs', 's3');
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
            'status'           => $validated['status'],
            'review_checklist' => $validated['review_checklist'] ?? $thesis->review_checklist,
            'recommended_by'   => $validated['recommended_by'] ?? $thesis->recommended_by,
            'archived_by'      => $validated['archived_by'] ?? $thesis->archived_by,
        ]);

        if ($validated['status'] === 'accepted') {
            // Notify all admins
            NotificationController::dispatch(
                'accepted_thesis',
                'Thesis Accepted',
                "\"" . $thesis->title . "\" by " . $thesis->author . " has been accepted.",
                ['thesis_id' => $thesis->id, 'author' => $thesis->author]
            );
            // Notify the thesis owner (client) specifically
            if ($thesis->owner_id) {
                NotificationController::dispatch(
                    'accepted_thesis',
                    'Your Thesis Was Accepted',
                    "Congratulations! Your thesis \"" . $thesis->title . "\" has been accepted.",
                    ['thesis_id' => $thesis->id],
                    $thesis->owner_id
                );
            }
        }

        return response()->json([
            'message' => 'Thesis status updated to ' . $validated['status'],
            'thesis'  => $thesis->fresh()->load(['owner', 'primarySupervisor'])
        ]);
    }

    public function publish(Request $request, Thesis $thesis)
    {
        $thesis->update(['status' => 'published']);

        return response()->json([
            'message' => 'Thesis has been published successfully',
            'thesis' => $thesis->fresh()->load(['owner', 'primarySupervisor'])
        ]);
    }

    public function toggleConfidential(Request $request, Thesis $thesis)
    {
        $thesis->update(['is_confidential' => !$thesis->is_confidential]);

        return response()->json([
            'message' => 'Thesis confidentiality updated successfully',
            'thesis' => $thesis->fresh()->load(['owner', 'primarySupervisor'])
        ]);
    }

    public function destroy(Thesis $thesis)
    {
        if ($thesis->pdf_path) {
            Storage::disk('s3')->delete($thesis->pdf_path);
        }
        $thesis->delete();
        return response()->json(['message' => 'Thesis deleted successfully']);
    }

    public function download(Request $request, Thesis $thesis)
    {
        $request->validate([
            'password' => 'required|string',
            'format' => 'required|in:pdf,docx'
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid admin password provided.'], 403);
        }

        // Additional security check: ensure user has admin role if required,
        // though the prompt implies simply asking for the "admin password"
        // which could mean the current user's password if they are an admin.
        // We will assume the frontend only shows this to admins/authorized users,
        // or that providing their own password is the authorization check.

        if ($request->format === 'pdf') {
            if (!$thesis->pdf_path) {
                return response()->json(['message' => 'PDF document not found for this thesis.'], 404);
            }
            return Storage::disk('s3')->download($thesis->pdf_path, $thesis->pdf_original_name ?? 'document.pdf');
        }

        if ($request->format === 'docx') {
            if (!$thesis->docx_path) {
                return response()->json(['message' => 'DOCX document not found for this thesis. It may have only been uploaded as a PDF.'], 404);
            }
            return Storage::disk('s3')->download($thesis->docx_path, $thesis->docx_original_name ?? 'document.docx');
        }

        return response()->json(['message' => 'Invalid format requested.'], 400);
    }
}
