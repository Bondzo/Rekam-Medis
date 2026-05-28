<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Queue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        if (auth()->user()->role === 'admin') {
            $patients = Patient::query()
                ->whereHas('medicalRecords')
                ->withCount('medicalRecords')
                ->when($search, function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('medical_record_number', 'like', "%{$search}%")
                            ->orWhere('gender', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(5)
                ->withQueryString();

            return Inertia::render('MedicalRecords/Index', [
                'mode' => 'admin',
                'patients' => $patients,
                'filters' => [
                    'search' => $search,
                ],
            ]);
        }

        $records = MedicalRecord::with(['patient', 'doctor', 'queue'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('diagnosis', 'like', "%{$search}%")
                        ->orWhere('medical_treatment', 'like', "%{$search}%")
                        ->orWhere('complaint', 'like', "%{$search}%")
                        ->orWhereHas('patient', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('medical_record_number', 'like', "%{$search}%");
                        })
                        ->orWhereHas('doctor', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('MedicalRecords/Index', [
            'mode' => 'doctor',
            'records' => $records,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function patientHistory(Patient $patient)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $patient->load([
            'medicalRecords' => function ($query) {
                $query->with('doctor')->latest('record_date')->latest();
            },
        ]);

        return Inertia::render('MedicalRecords/PatientHistory', [
            'patient' => $patient,
        ]);
    }

    public function create(Request $request)
    {
        $queue = null;

        if ($request->has('queue_id')) {
            $queue = Queue::with(['patient', 'doctor'])->findOrFail($request->queue_id);
        }

        return Inertia::render('MedicalRecords/Create', [
            'queue' => $queue,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'queue_id' => 'nullable|exists:queues,id',
            'complaint' => 'required|string',
            'physical_examination' => 'required|string',
            'diagnosis' => 'required|string',
            'medical_treatment' => 'required|string',
            'record_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        MedicalRecord::create($validated);

        if (!empty($validated['queue_id'])) {
            Queue::where('id', $validated['queue_id'])->update([
                'status' => 'done',
            ]);
        }

        return redirect()
            ->route('medical-records.index')
            ->with('success', 'Medical record created successfully.');
    }

    public function show(MedicalRecord $medicalRecord)
    {
        $medicalRecord->load(['patient', 'doctor', 'queue']);

        return Inertia::render('MedicalRecords/Show', [
            'record' => $medicalRecord,
        ]);
    }

    public function edit(MedicalRecord $medicalRecord)
    {
        $medicalRecord->load(['patient', 'doctor', 'queue']);

        return Inertia::render('MedicalRecords/Edit', [
            'record' => $medicalRecord,
        ]);
    }

public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'complaint' => 'required|string',
            'physical_examination' => 'required|string',
            'diagnosis' => 'required|string',
            'medical_treatment' => 'required|string',
            'record_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $medicalRecord->update($validated);

        return redirect()
            ->route('medical-records.index')
            ->with('success', 'Medical record updated successfully.');
    }

public function destroy(MedicalRecord $medicalRecord)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $medicalRecord->delete();

        return redirect()
            ->back()
            ->with('success', 'Medical record deleted successfully.');
    }
}
