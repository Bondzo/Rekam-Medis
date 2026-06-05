<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index(Request $request)
        {
            $search = $request->search;

            $doctors = Doctor::query()
                ->with('user:id,name,email,role')
                ->when($search, function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('specialist', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('email', 'like', "%{$search}%");
                        });
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
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'specialist' => ['required', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:255'],
                'address' => ['nullable', 'string'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            DB::transaction(function () use ($validated) {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'doctor',
                ]);

                Doctor::create([
                    'user_id' => $user->id,
                    'name' => $validated['name'],
                    'specialist' => $validated['specialist'],
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]);
            });

            return redirect()->route('doctors.index');
        }

    public function destroy(Doctor $doctor)
        {
            DB::transaction(function () use ($doctor) {
                $user = $doctor->user;

                $doctor->delete();

                if ($user && $user->role === 'doctor') {
                    $user->delete();
                }
            });

            return redirect()->route('doctors.index');
        }

    public function edit(Doctor $doctor)
        {
            $doctor->load('user:id,name,email,role');

            return Inertia::render('Doctors/Edit', [
                'doctor' => $doctor
            ]);
        }

    public function update(
            Request $request,
            Doctor $doctor
        )
        {
            $user = $doctor->user;

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'specialist' => ['required', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:255'],
                'address' => ['nullable', 'string'],
                'email' => [
                    'nullable',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($user?->id),
                ],
                'password' => [
                    Rule::requiredIf(!$user && $request->filled('email')),
                    'nullable',
                    'string',
                    'min:8',
                    'confirmed',
                ],
            ]);

            DB::transaction(function () use ($doctor, $user, $validated) {
                if ($user) {
                    $userData = [
                        'name' => $validated['name'],
                    ];

                    if (!empty($validated['email'])) {
                        $userData['email'] = $validated['email'];
                    }

                    if (!empty($validated['password'])) {
                        $userData['password'] = Hash::make($validated['password']);
                    }

                    $user->update($userData);
                }

                $doctor->fill([
                    'name' => $validated['name'],
                    'specialist' => $validated['specialist'],
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]);

                $doctor->save();
            });

            return redirect()->route('doctors.index');
        }
}
