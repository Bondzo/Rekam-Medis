<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index()
        {
            $doctors = Doctor::latest()->get();

            return Inertia::render('Doctors/Index', [
                'doctors' => $doctors
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
}