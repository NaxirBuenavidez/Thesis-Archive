<?php

namespace App\Http\Controllers;

use App\Models\SeniorHighProgram;
use Illuminate\Http\Request;

class SeniorHighProgramController extends Controller
{
    public function index(Request $request)
    {
        $query = SeniorHighProgram::with('department');

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string',
            'code' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $program = SeniorHighProgram::create($validated);

        return response()->json($program->load('department'), 201);
    }

    public function update(Request $request, $id)
    {
        $program = SeniorHighProgram::findOrFail($id);

        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string',
            'code' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $program->update($validated);

        return response()->json($program->load('department'));
    }

    public function destroy($id)
    {
        $program = SeniorHighProgram::findOrFail($id);
        $program->delete();

        return response()->json(null, 204);
    }
}
