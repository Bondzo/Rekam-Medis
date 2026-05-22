<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Medicine;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PrescriptionController extends Controller
{
    public function index()
    {
        $prescriptions = Prescription::with([
            'medicalRecord.patient',
            'medicalRecord.doctor',
            'items.medicine',
        ])->latest()->get();

        return Inertia::render('Prescriptions/Index', [
            'prescriptions' => $prescriptions,
        ]);
    }

    public function create(Request $request)
    {
        $medicalRecord = null;

        if ($request->has('medical_record_id')) {
            $medicalRecord = MedicalRecord::with(['patient', 'doctor'])
                ->findOrFail($request->medical_record_id);
        }

        return Inertia::render('Prescriptions/Create', [
            'medicalRecord' => $medicalRecord,
            'medicalRecords' => MedicalRecord::with(['patient', 'doctor'])
                ->doesntHave('prescription')
                ->latest()
                ->get(),
            'medicines' => Medicine::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medical_record_id' => [
                'required',
                'exists:medical_records,id',
                Rule::unique('prescriptions', 'medical_record_id'),
            ],
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.dosage' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated) {
            $prescription = Prescription::create([
                'medical_record_id' => $validated['medical_record_id'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $medicine = Medicine::where('id', $item['medicine_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($medicine->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Stock obat {$medicine->name} tidak cukup.",
                    ]);
                }

                $subtotal = $medicine->price * $item['quantity'];

                $prescription->items()->create([
                    'medicine_id' => $medicine->id,
                    'dosage' => $item['dosage'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ]);

                $medicine->decrement('stock', $item['quantity']);
            }
        });

        return redirect()
            ->route('prescriptions.index')
            ->with('success', 'Prescription created successfully.');
    }
}
