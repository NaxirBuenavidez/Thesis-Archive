<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $query = Program::with('department');

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('senior_high') && $request->senior_high == 'true') {
             $query->whereHas('department', function($q) {
                 $q->where('name', 'SENIOR HIGH SCHOOL');
             });
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

        $program = Program::create($validated);

        return response()->json($program->load('department'), 201);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);

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
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(null, 204);
    }
}
