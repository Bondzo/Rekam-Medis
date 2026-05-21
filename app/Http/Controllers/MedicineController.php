<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index()
    {
        $medicines = Medicine::latest()->get();

        return Inertia::render('Medicines/Index', [
            'medicines' => $medicines,
        ]);
    }

    public function create()
    {
        return Inertia::render('Medicines/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        Medicine::create($validated);

        return redirect()
            ->route('medicines.index')
            ->with('success', 'Medicine created successfully.');
    }

    public function edit(Medicine $medicine)
    {
        return Inertia::render('Medicines/Edit', [
            'medicine' => $medicine,
        ]);
    }

    public function update(Request $request, Medicine $medicine)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $medicine->update($validated);

        return redirect()
            ->route('medicines.index')
            ->with('success', 'Medicine updated successfully.');
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return redirect()
            ->route('medicines.index')
            ->with('success', 'Medicine deleted successfully.');
    }
}