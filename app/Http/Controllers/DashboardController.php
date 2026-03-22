<?php

namespace App\Http\Controllers;

use App\Models\Thesis;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function analytics()
    {
        \Illuminate\Support\Facades\Log::debug('DashboardController: Fetching analytics data');
        $data = Cache::remember('dashboard_analytics', 60 * 5, function () {
            \Illuminate\Support\Facades\Log::debug('DashboardController: Cache miss, calculating analytics');
            // --- Totals ---
            $totalTheses      = Thesis::count();
            $publishedTheses  = Thesis::where('status', 'published')->count();
            $pendingReview    = Thesis::where('status', 'under_review')->count();
            $totalUsers       = User::count();
            $confidentialTheses = Thesis::where('is_confidential', true)->count();
            $acceptedTheses   = Thesis::where('status', 'accepted')->count();
            $rejectedTheses   = Thesis::where('status', 'rejected')->count();
            $draftTheses      = Thesis::where('status', 'draft')->count();
            $submittedTheses  = Thesis::where('status', 'submitted')->count();

            // --- By Status (for Pie/Bar chart) ---
            $byStatus = Thesis::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get()
                ->map(fn($item) => ['name' => ucwords(str_replace('_', ' ', $item->status)), 'value' => (int) $item->count])
                ->values();

            // --- By Department (for Bar chart) ---
            $byDepartment = Thesis::select('department', DB::raw('count(*) as count'))
                ->whereNotNull('department')
                ->groupBy('department')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->map(fn($item) => ['name' => $item->department ?: 'Unknown', 'count' => (int) $item->count])
                ->values();

            // --- By Degree Type ---
            $byDegreeType = Thesis::select('degree_type', DB::raw('count(*) as count'))
                ->whereNotNull('degree_type')
                ->groupBy('degree_type')
                ->get()
                ->map(fn($item) => ['name' => $item->degree_type ?: 'Unknown', 'value' => (int) $item->count])
                ->values();

            // --- Monthly Submission Trend (last 12 months) — PostgreSQL compatible ---
            $monthlyTrend = Thesis::select(
                    DB::raw("TO_CHAR(created_at, 'YYYY-MM') as month"),
                    DB::raw('count(*) as count')
                )
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(fn($item) => ['month' => $item->month, 'submissions' => (int) $item->count])
                ->values();

            // --- Recent Activity (latest 5 theses modified) ---
            $recentActivity = Thesis::with('owner')
                ->latest('updated_at')
                ->limit(5)
                ->get()
                ->map(fn($t) => [
                    'id'         => $t->id,
                    'title'      => $t->title,
                    'author'     => $t->author,
                    'status'     => $t->status,
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
                ->map(fn($item) => ['department' => $item->department, 'published' => (int) $item->count])
                ->values();

            return [
                'totals' => [
                    'total_theses'   => $totalTheses,
                    'published'      => $publishedTheses,
                    'pending_review' => $pendingReview,
                    'accepted'       => $acceptedTheses,
                    'rejected'       => $rejectedTheses,
                    'draft'          => $draftTheses,
                    'submitted'      => $submittedTheses,
                    'confidential'   => $confidentialTheses,
                    'total_users'    => $totalUsers,
                ],
                'by_status'           => $byStatus,
                'by_department'       => $byDepartment,
                'by_degree_type'      => $byDegreeType,
                'monthly_trend'       => $monthlyTrend,
                'recent_activity'     => $recentActivity,
                'top_dept_published'  => $topDeptPublished,
            ];
        });

        return response()->json($data);
    }
}
