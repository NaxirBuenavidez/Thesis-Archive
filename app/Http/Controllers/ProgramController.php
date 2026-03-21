<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Program;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json(Program::with('department')->orderBy('name')->get());
    }

    public function seniorHigh()
    {
        return response()->json(Program::with('department')
            ->whereHas('department', function ($query) {
                $query->where('name', 'SENIOR HIGH SCHOOL');
            })->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        \Illuminate\Support\Facades\Cache::forget('system_programs');
        $program = Program::create($validated);
        return response()->json($program->load('department'), 201);
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        \Illuminate\Support\Facades\Cache::forget('system_programs');
        $program->update($validated);
        return response()->json($program->load('department'));
    }

    public function destroy(Program $program)
    {
        \Illuminate\Support\Facades\Cache::forget('system_programs');
        $program->delete();
        return response()->json(['message' => 'Program deleted successfully']);
    }
}
