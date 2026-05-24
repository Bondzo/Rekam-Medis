<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Prescription;
use App\Models\Queue;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $today = Carbon::today();

        if ($user->role === 'doctor') {
            // TODO: Replace this name lookup with a doctors.user_id relation when available.
            $doctor = Doctor::where('name', $user->name)->first();
            $doctorId = $doctor?->id;

            $todayQueues = Queue::with(['patient:id,name'])
                ->where('doctor_id', $doctorId)
                ->whereDate('queue_date', $today)
                ->latest()
                ->get();

            return Inertia::render(
                'Dashboard',
                [
                    'role' => 'doctor',
                    'doctorName' => $doctor?->name ?? $user->name,
                    'todayQueues' => $todayQueues,
                    'totalWaitingQueues' => Queue::where('doctor_id', $doctorId)
                        ->whereDate('queue_date', $today)
                        ->where('status', 'waiting')
                        ->count(),
                    'totalCheckingQueues' => Queue::where('doctor_id', $doctorId)
                        ->whereDate('queue_date', $today)
                        ->where('status', 'checking')
                        ->count(),
                    'totalDoneQueues' => Queue::where('doctor_id', $doctorId)
                        ->whereDate('queue_date', $today)
                        ->where('status', 'done')
                        ->count(),
                    'totalMedicalRecords' => MedicalRecord::where('doctor_id', $doctorId)->count(),
                    'recentQueues' => Queue::with(['patient:id,name'])
                        ->where('doctor_id', $doctorId)
                        ->latest()
                        ->take(5)
                        ->get(),
                ]
            );
        }

        if ($user->role === 'staff') {
            return Inertia::render(
                'Dashboard',
                [
                    'role' => 'staff',
                    'totalPatients' => Patient::count(),
                    'totalQueuesToday' => Queue::whereDate('queue_date', $today)->count(),
                    'totalWaitingQueues' => Queue::whereDate('queue_date', $today)
                        ->where('status', 'waiting')
                        ->count(),
                    'totalMedicines' => Medicine::count(),
                    'totalLowStockMedicines' => Medicine::where('stock', '<=', 10)->count(),
                    'totalUnpaidPayments' => Payment::where('status', 'unpaid')->count(),
                    'totalPaidPaymentsToday' => Payment::where('status', 'paid')
                        ->whereDate('payment_date', $today)
                        ->count(),
                    'recentQueues' => Queue::with(['patient:id,name', 'doctor:id,name'])
                        ->latest()
                        ->take(5)
                        ->get(),
                    'recentPayments' => Payment::with(['medicalRecord.patient:id,name'])
                        ->latest()
                        ->take(5)
                        ->get(),
                ]
            );
        }

        return Inertia::render(
            'Dashboard',
            [
                'role' => 'admin',
                'totalPatients' => Patient::count(),
                'totalDoctors' => Doctor::count(),
                'totalQueuesToday' => Queue::whereDate('queue_date', $today)->count(),
                'totalMedicalRecords' => MedicalRecord::count(),
                'totalMedicines' => Medicine::count(),
                'totalPrescriptions' => Prescription::count(),
                'totalPayments' => Payment::count(),
                'totalIncomePaid' => Payment::where('status', 'paid')->sum('total_payment'),
                'recentQueues' => Queue::with(['patient:id,name', 'doctor:id,name'])
                    ->latest()
                    ->take(5)
                    ->get(),
                'recentPayments' => Payment::with(['medicalRecord.patient:id,name'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ]
        );
    }
}
