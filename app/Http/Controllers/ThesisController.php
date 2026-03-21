<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\User;
use App\Models\Role;
use App\Http\Controllers\NotificationController;
use App\Http\Resources\ThesisResource;
use App\Http\Requests\StoreThesisRequest;
use App\Http\Requests\UpdateThesisRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ThesisController extends Controller
{
    public function index()
    {
        $theses = Thesis::with(['owner.profile', 'primarySupervisor'])->latest()->get();
        return ThesisResource::collection($theses);
    }

    public function publicIndex(Request $request)
    {
        // Enforce strict public visibility: published only, not confidential
        $theses = Thesis::with(['owner.profile', 'primarySupervisor'])
            ->where('status', 'published')
            ->where('is_confidential', false)
            ->latest()
            ->get();

        return ThesisResource::collection($theses);
    }

    public function store(StoreThesisRequest $request)
    {
        $validated = $request->validated();
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

        return (new ThesisResource($thesis->load(['owner', 'primarySupervisor'])))
            ->additional(['message' => 'Thesis created successfully'])
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateThesisRequest $request, Thesis $thesis)
    {
        $validated = $request->validated();

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

        return (new ThesisResource($thesis->load(['owner', 'primarySupervisor'])))
            ->additional(['message' => 'Thesis updated successfully']);
    }

    public function show(Thesis $thesis)
    {
        return new ThesisResource($thesis->load(['owner', 'primarySupervisor']));
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

        return (new ThesisResource($thesis->fresh()->load(['owner', 'primarySupervisor'])))
            ->additional(['message' => 'Thesis status updated to ' . $validated['status']]);
    }

    public function publish(Request $request, Thesis $thesis)
    {
        $thesis->update(['status' => 'published']);

        return (new ThesisResource($thesis->fresh()->load(['owner', 'primarySupervisor'])))
            ->additional(['message' => 'Thesis has been published successfully']);
    }

    public function toggleConfidential(Request $request, Thesis $thesis)
    {
        $thesis->update(['is_confidential' => !$thesis->is_confidential]);

        return (new ThesisResource($thesis->fresh()->load(['owner', 'primarySupervisor'])))
            ->additional(['message' => 'Thesis confidentiality updated successfully']);
    }

    public function destroy(Thesis $thesis)
    {
        if ($thesis->pdf_path) {
            Storage::disk('s3')->delete($thesis->pdf_path);
        }
        $thesis->delete();
        return response()->json(['message' => 'Thesis deleted successfully']);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:theses,id'
        ]);

        $theses = Thesis::whereIn('id', $request->ids)->get();
        
        foreach ($theses as $thesis) {
            if ($thesis->pdf_path) {
                Storage::disk('s3')->delete($thesis->pdf_path);
            }
            $thesis->delete();
        }

        return response()->json(['message' => count($request->ids) . ' theses deleted successfully']);
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

