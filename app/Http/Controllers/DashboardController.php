<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Queue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'doctor') {

            $doctor = Doctor::where(
                'name',
                $user->name
            )->first();

            $queues = Queue::with([
                'patient'
            ])
            ->where(
                'doctor_id',
                $doctor?->id
            )
            ->latest()
            ->take(5)
            ->get();

            return Inertia::render(
                'Dashboard',
                [
                    'role' => 'doctor',
                    'queues' => $queues,
                ]
            );
        }

        return Inertia::render(
            'Dashboard',
            [
                'role' => 'admin',

                'totalPatients' =>
                    Patient::count(),

                'totalQueues' =>
                    Queue::count(),

                'totalDoctors' =>
                    Doctor::count(),
            ]
        );
    }
}