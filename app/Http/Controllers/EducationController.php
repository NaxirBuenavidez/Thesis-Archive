<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EducationalBackground;
use Illuminate\Support\Facades\Auth;

class EducationController extends Controller
{
    public function index()
    {
        return Auth::user()->educationalBackgrounds()->orderBy('year_start', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'level' => 'required|string|max:255',
            'school_name' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'year_start' => 'required|integer|min:1900|max:'.(date('Y')+5),
            'year_end' => 'nullable|integer|min:1900|max:'.(date('Y')+10).'|gte:year_start',
            'description' => 'nullable|string',
        ]);

        return Auth::user()->educationalBackgrounds()->create($validated);
    }

    public function update(Request $request, $id)
    {
        $education = Auth::user()->educationalBackgrounds()->findOrFail($id);

        $validated = $request->validate([
            'level' => 'required|string|max:255',
            'school_name' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'year_start' => 'required|integer|min:1900|max:'.(date('Y')+5),
            'year_end' => 'nullable|integer|min:1900|max:'.(date('Y')+10).'|gte:year_start',
            'description' => 'nullable|string',
        ]);

        $education->update($validated);

        return $education;
    }

    public function destroy($id)
    {
        $education = Auth::user()->educationalBackgrounds()->findOrFail($id);
        $education->delete();

        return response()->noContent();
    }
}
