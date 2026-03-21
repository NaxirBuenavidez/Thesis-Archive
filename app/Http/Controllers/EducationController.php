<?php

namespace App\Http\Controllers;

use App\Models\EducationalBackground;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index(Request $request)
    {
        $education = EducationalBackground::where('user_id', $request->user()->id)
            ->orderByDesc('year_start')
            ->get();

        return response()->json($education);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'level'       => 'required|string|max:255',
            'school_name' => 'required|string|max:255',
            'degree'      => 'nullable|string|max:255',
            'year_start'  => 'required|integer|min:1900|max:2100',
            'year_end'    => 'nullable|integer|min:1900|max:2100',
            'description' => 'nullable|string',
        ]);

        $education = EducationalBackground::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($education, 201);
    }

    public function update(Request $request, EducationalBackground $education)
    {
        // Ensure the education entry belongs to the authenticated user
        if ($education->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'level'       => 'sometimes|required|string|max:255',
            'school_name' => 'sometimes|required|string|max:255',
            'degree'      => 'nullable|string|max:255',
            'year_start'  => 'sometimes|required|integer|min:1900|max:2100',
            'year_end'    => 'nullable|integer|min:1900|max:2100',
            'description' => 'nullable|string',
        ]);

        $education->update($validated);

        return response()->json($education);
    }

    public function destroy(Request $request, EducationalBackground $education)
    {
        if ($education->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $education->delete();

        return response()->json(['message' => 'Education deleted successfully']);
    }
}
