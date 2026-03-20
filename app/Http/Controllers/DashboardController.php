<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function analytics()
    {
        // --- Totals ---
        $totalTheses = Thesis::count();
        $publishedTheses = Thesis::where('status', 'published')->count();
        $pendingReview = Thesis::where('status', 'under_review')->count();
        $totalUsers = User::count();
        $confidentialTheses = Thesis::where('is_confidential', true)->count();
        $acceptedTheses = Thesis::where('status', 'accepted')->count();
        $rejectedTheses = Thesis::where('status', 'rejected')->count();
        $draftTheses = Thesis::where('status', 'draft')->count();
        $submittedTheses = Thesis::where('status', 'submitted')->count();

        // --- By Status (for Pie/Bar chart) ---
        $byStatus = Thesis::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn($item) => ['name' => ucwords(str_replace('_', ' ', $item->status)), 'value' => $item->count])
            ->values();

        // --- By Department (for Bar chart) ---
        $byDepartment = Thesis::select('department', DB::raw('count(*) as count'))
            ->whereNotNull('department')
            ->groupBy('department')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn($item) => ['name' => $item->department ?: 'Unknown', 'count' => $item->count])
            ->values();

        // --- By Degree Type ---
        $byDegreeType = Thesis::select('degree_type', DB::raw('count(*) as count'))
            ->whereNotNull('degree_type')
            ->groupBy('degree_type')
            ->get()
            ->map(fn($item) => ['name' => $item->degree_type ?: 'Unknown', 'value' => $item->count])
            ->values();

        // --- Monthly Submission Trend (last 12 months) ---
        $monthlyTrend = Thesis::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($item) => ['month' => $item->month, 'submissions' => $item->count])
            ->values();

        // --- Recent Activity (latest 5 theses modified) ---
        $recentActivity = Thesis::with('owner')
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'author' => $t->author,
                'status' => $t->status,
                'department' => $t->department,
                'updated_at' => $t->updated_at?->diffForHumans(),
                'updated_by' => $t->owner?->name,
            ]);

        // --- Top Departments by Published ---
        $topDeptPublished = Thesis::select('department', DB::raw('count(*) as count'))
            ->where('status', 'published')
            ->whereNotNull('department')
            ->groupBy('department')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn($item) => ['department' => $item->department, 'published' => $item->count])
            ->values();

        return response()->json([
            'totals' => [
                'total_theses' => $totalTheses,
                'published' => $publishedTheses,
                'pending_review' => $pendingReview,
                'accepted' => $acceptedTheses,
                'rejected' => $rejectedTheses,
                'draft' => $draftTheses,
                'submitted' => $submittedTheses,
                'confidential' => $confidentialTheses,
                'total_users' => $totalUsers,
            ],
            'by_status' => $byStatus,
            'by_department' => $byDepartment,
            'by_degree_type' => $byDegreeType,
            'monthly_trend' => $monthlyTrend,
            'recent_activity' => $recentActivity,
            'top_dept_published' => $topDeptPublished,
        ]);
    }
}
