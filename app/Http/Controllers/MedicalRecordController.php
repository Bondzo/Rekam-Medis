<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Queue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $user = auth()->user();
        $today = Carbon::today();
        $doctor = $user->role === 'doctor'
            ? $this->doctorProfile()
            : null;

        $patients = Patient::query()
            ->whereHas('medicalRecords', function ($query) use ($user, $today, $doctor) {
                if ($user->role === 'admin') {
                    return;
                }

                $query->whereDate('record_date', $today);

                if ($user->role === 'doctor') {
                    $query->where('doctor_id', $doctor?->id);
                }
            })
            ->withCount([
                'medicalRecords' => function ($query) use ($user, $today, $doctor) {
                    if ($user->role === 'admin') {
                        return;
                    }

                    $query->whereDate('record_date', $today);

                    if ($user->role === 'doctor') {
                        $query->where('doctor_id', $doctor?->id);
                    }
                },
            ])
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
            'patients' => $patients,
            'filters' => [
                'search' => $search,
            ],
            'todayOnly' => $user->role !== 'admin',
        ]);
    }

    public function patientHistory(Patient $patient)
    {
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
            $this->authorizeClinicalQueue($queue);
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
            'physical_examination' => 'nullable|string',
            'diagnosis' => 'required|string',
            'medical_treatment' => 'required|string',
            'record_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['physical_examination'] = $validated['physical_examination'] ?? '';

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
        $this->authorizeClinicalRecordMutation($medicalRecord);

        $medicalRecord->load(['patient', 'doctor', 'queue']);

        return Inertia::render('MedicalRecords/Edit', [
            'record' => $medicalRecord,
        ]);
    }

public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $this->authorizeClinicalRecordMutation($medicalRecord);

        $validated = $request->validate([
            'complaint' => 'required|string',
            'physical_examination' => 'nullable|string',
            'diagnosis' => 'required|string',
            'medical_treatment' => 'required|string',
            'record_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['physical_examination'] = $validated['physical_examination'] ?? '';

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

    private function authorizeClinicalQueue(Queue $queue): void
    {
        $user = auth()->user();

        if (in_array($user->role, ['admin', 'staff'], true)) {
            return;
        }

        $doctor = $this->doctorProfile();

        if (
            !$doctor ||
            $queue->doctor_id !== $doctor->id ||
            !Carbon::parse($queue->queue_date)->isSameDay(Carbon::today())
        ) {
            abort(403);
        }
    }

    private function authorizeClinicalRecordMutation(MedicalRecord $medicalRecord): void
    {
        $user = auth()->user();

        if (in_array($user->role, ['admin', 'staff'], true)) {
            return;
        }

        $doctor = $this->doctorProfile();

        if (
            !$doctor ||
            $medicalRecord->doctor_id !== $doctor->id ||
            !Carbon::parse($medicalRecord->record_date)->isSameDay(Carbon::today())
        ) {
            abort(403);
        }
    }

    private function doctorProfile(): ?Doctor
    {
        return Doctor::where('user_id', auth()->id())->first();
    }
}
