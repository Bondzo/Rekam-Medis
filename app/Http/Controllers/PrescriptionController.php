<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Medicine;
use App\Models\Prescription;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $user = auth()->user();
        $today = Carbon::today();
        $doctor = $user->role === 'doctor'
            ? $this->doctorProfile()
            : null;

        $prescriptions = Prescription::with([
            'medicalRecord.patient',
            'medicalRecord.doctor',
            'items.medicine',
        ])
            ->when($user->role === 'doctor', function ($query) use ($today, $doctor) {
                $query->whereDate('created_at', $today)
                    ->whereHas('medicalRecord', function ($query) use ($doctor) {
                        $query->where('doctor_id', $doctor?->id);
                    });
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('notes', 'like', "%{$search}%")
                        ->orWhereHas('medicalRecord.patient', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('medical_record_number', 'like', "%{$search}%");
                        })
                        ->orWhereHas('medicalRecord.doctor', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('items.medicine', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Prescriptions/Index', [
            'prescriptions' => $prescriptions,
            'filters' => [
                'search' => $search,
            ],
            'todayOnly' => $user->role !== 'admin',
        ]);
    }

    public function create(Request $request)
    {
        $medicalRecord = null;
        $user = auth()->user();
        $today = Carbon::today();
        $doctor = $user->role === 'doctor'
            ? $this->doctorProfile()
            : null;

        if ($request->has('medical_record_id')) {
            $medicalRecord = MedicalRecord::with(['patient', 'doctor'])
                ->findOrFail($request->medical_record_id);

            if ($user->role === 'doctor' && (
                !$doctor ||
                $medicalRecord->doctor_id !== $doctor->id ||
                !Carbon::parse($medicalRecord->record_date)->isSameDay($today)
            )) {
                abort(403);
            }
        }

        return Inertia::render('Prescriptions/Create', [
            'medicalRecord' => $medicalRecord,
            'medicalRecords' => MedicalRecord::with(['patient', 'doctor'])
                ->when($user->role === 'doctor', function ($query) use ($today, $doctor) {
                    $query->where('doctor_id', $doctor?->id)
                        ->whereDate('record_date', $today);
                })
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

        if (auth()->user()->role === 'doctor') {
            $doctor = $this->doctorProfile();
            $medicalRecord = MedicalRecord::findOrFail($validated['medical_record_id']);

            if (
                !$doctor ||
                $medicalRecord->doctor_id !== $doctor->id ||
                !Carbon::parse($medicalRecord->record_date)->isSameDay(Carbon::today())
            ) {
                abort(403);
            }
        }

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

    private function doctorProfile(): ?Doctor
    {
        return Doctor::where('user_id', auth()->id())->first();
    }
}
