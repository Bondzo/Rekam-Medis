<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $staff = User::query()
            ->where('role', 'staff')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Staff/Index', [
            'staff' => $staff,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'staff',
        ]);

        return redirect()->route('staff.index');
    }

    public function edit(User $staff)
    {
        $this->ensureStaff($staff);

        return Inertia::render('Staff/Edit', [
            'staff' => $staff,
        ]);
    }

    public function update(Request $request, User $staff)
    {
        $this->ensureStaff($staff);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($staff->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $staff->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $staff->password = Hash::make($validated['password']);
        }

        $staff->save();

        return redirect()->route('staff.index');
    }

    public function destroy(User $staff)
    {
        $this->ensureStaff($staff);

        if ($staff->id === auth()->id()) {
            abort(403);
        }

        $staff->delete();

        return redirect()->route('staff.index');
    }

    private function ensureStaff(User $staff): void
    {
        if ($staff->role !== 'staff') {
            abort(404);
        }
    }
}
