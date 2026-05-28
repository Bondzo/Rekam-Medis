<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index(Request $request)
        {
            $search = $request->search;

            $doctors = Doctor::query()
                ->when($search, function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('specialist', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                })
                ->latest()
                ->paginate(5)
                ->withQueryString();

            return Inertia::render('Doctors/Index', [
                'doctors' => $doctors,
                'filters' => [
                    'search' => $search,
                ],
            ]);
        }

    public function create()
        {
            return Inertia::render('Doctors/Create');
        }

    public function store(Request $request)
        {
            $request->validate([
                'name' => 'required',
                'specialist' => 'required',
            ]);

            Doctor::create([
                'name' => $request->name,
                'specialist' => $request->specialist,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return redirect()->route('doctors.index');
        }

    public function destroy(Doctor $doctor)
        {
            $doctor->delete();

            return redirect()->route('doctors.index');
        }

    public function edit(Doctor $doctor)
        {
            return Inertia::render('Doctors/Edit', [
                'doctor' => $doctor
            ]);
        }

    public function update(
            Request $request,
            Doctor $doctor
        )
        {
            $request->validate([
                'name' => 'required',
                'specialist' => 'required',
            ]);

            $doctor->update([
                'name' => $request->name,
                'specialist' => $request->specialist,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return redirect()->route('doctors.index');
        }
}
