<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    private function buildQuery(Request $request)
    {
        $query = Thesis::query();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('department') && $request->department !== 'all') {
            // Thesis uses dept_id or department name? 
            // The model shows 'department' as fillable string, but 'dept_id' might be used depending on previous edits. 
            // We'll search both or just 'department' depending on what is sent.
            // In Thesis dashboard they send department name or id. Let's assume frontend sends department name.
            $query->where('department', $request->department);
        }
        
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('submission_date', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        return $query;
    }

    public function preview(Request $request)
    {
        $query = $this->buildQuery($request);
        
        // Return metrics
        $metrics = [
            'total' => (clone $query)->count(),
            'published' => (clone $query)->where('status', 'published')->count(),
            'pending' => (clone $query)->where('status', 'under_review')->count(),
        ];

        // Return paginated data
        $data = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return response()->json([
            'metrics' => $metrics,
            'data' => $data
        ]);
    }

    public function export(Request $request)
    {
        $query = $this->buildQuery($request);

        $response = new StreamedResponse(function () use ($query) {
            $handle = fopen('php://output', 'w');
            
            // Output UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Add headers
            fputcsv($handle, [
                'ID',
                'Title',
                'Main Author',
                'Co-Authors',
                'Department',
                'Program',
                'Degree Type',
                'Status',
                'Submission Date',
                'Confidential',
            ]);

            // Chunking for performance on large databases
            $query->chunk(500, function ($theses) use ($handle) {
                foreach ($theses as $thesis) {
                    fputcsv($handle, [
                        $thesis->id,
                        $thesis->title,
                        $thesis->author,
                        $thesis->co_author ?? 'N/A',
                        $thesis->department,
                        $thesis->discipline,
                        $thesis->degree_type ?? 'N/A',
                        strtoupper(str_replace('_', ' ', $thesis->status)),
                        $thesis->submission_date ? $thesis->submission_date->format('Y-m-d') : 'N/A',
                        $thesis->is_confidential ? 'Yes' : 'No',
                    ]);
                }
            });

            fclose($handle);
        });

        $timestamp = now()->format('Ymd_His');
        $filename = "Archive_Report_{$timestamp}.csv";

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', "attachment; filename=\"{$filename}\"");

        return $response;
    }
}
