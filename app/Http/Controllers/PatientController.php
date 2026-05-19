<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::latest()->get();

        return Inertia::render('Patients/Index', [
            'patients' => $patients
        ]);
    }

    public function create()
    {
        return Inertia::render('Patients/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nik' => 'required|unique:patients',
            'name' => 'required',
            'gender' => 'required',
            'birth_date' => 'required',
        ]);

        $latestPatient = Patient::latest()->first();

        $number = 1;

        if ($latestPatient) {
            $number = $latestPatient->id + 1;
        }

        $medicalRecordNumber =
            'RM' . str_pad($number, 3, '0', STR_PAD_LEFT);

        Patient::create([
            'medical_record_number' => $medicalRecordNumber,

            'nik' => $request->nik,

            'name' => $request->name,

            'gender' => $request->gender,

            'birth_date' => $request->birth_date,

            'phone' => $request->phone,

            'address' => $request->address,
        ]);

        return redirect()->route('patients.index');
    }

    public function edit(Patient $patient)
        {
            return Inertia::render('Patients/Edit', [
                'patient' => $patient
            ]);
        }

    public function update(Request $request, Patient $patient)
        {
            $request->validate([
                'nik' => 'required|unique:patients,nik,' . $patient->id,
                'name' => 'required',
                'gender' => 'required',
                'birth_date' => 'required',
            ]);

            $patient->update([
                'nik' => $request->nik,
                'name' => $request->name,
                'gender' => $request->gender,
                'birth_date' => $request->birth_date,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return redirect()->route('patients.index');
        }
}