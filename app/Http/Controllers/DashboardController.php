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

        switch ($user->role) {
            case 'doctor':
                $doctor = $this->doctorProfile();
                $doctorId = $doctor?->id;

                $todayQueuesQuery = Queue::query()
                    ->when(
                        $doctorId,
                        fn ($query) => $query->where('doctor_id', $doctorId),
                        fn ($query) => $query->whereRaw('1 = 0')
                    )
                    ->whereDate('queue_date', $today);

                $todayMedicalRecordsQuery = MedicalRecord::query()
                    ->when(
                        $doctorId,
                        fn ($query) => $query->where('doctor_id', $doctorId),
                        fn ($query) => $query->whereRaw('1 = 0')
                    )
                    ->whereDate('record_date', $today);

                $todayPrescriptionsQuery = Prescription::query()
                    ->when(
                        $doctorId,
                        fn ($query) => $query->whereHas('medicalRecord', function ($query) use ($doctorId) {
                            $query->where('doctor_id', $doctorId);
                        }),
                        fn ($query) => $query->whereRaw('1 = 0')
                    )
                    ->whereDate('created_at', $today);

                return Inertia::render(
                    'Dashboard',
                    [
                        'role' => 'doctor',
                        'doctorName' => $doctor?->name ?? $user->name,
                        'doctorProfileMissing' => !$doctor,
                        'todayQueues' => (clone $todayQueuesQuery)
                            ->with(['patient:id,name'])
                            ->latest()
                            ->get(),
                        'totalWaitingQueuesToday' => (clone $todayQueuesQuery)
                            ->where('status', 'waiting')
                            ->count(),
                        'totalCheckingQueuesToday' => (clone $todayQueuesQuery)
                            ->where('status', 'checking')
                            ->count(),
                        'totalDoneQueuesToday' => (clone $todayQueuesQuery)
                            ->where('status', 'done')
                            ->count(),
                        'totalMedicalRecordsToday' => (clone $todayMedicalRecordsQuery)->count(),
                        'totalPrescriptionsToday' => (clone $todayPrescriptionsQuery)->count(),
                        'recentQueues' => (clone $todayQueuesQuery)
                            ->with(['patient:id,name'])
                            ->latest()
                            ->take(5)
                            ->get(),
                        'recentMedicalRecords' => (clone $todayMedicalRecordsQuery)
                            ->with(['patient:id,name'])
                            ->latest()
                            ->take(5)
                            ->get(),
                    ]
                );

            case 'staff':
                $todayQueuesQuery = Queue::whereDate('queue_date', $today);
                $todayPaymentsQuery = Payment::whereDate('payment_date', $today);

                return Inertia::render(
                    'Dashboard',
                    [
                        'role' => 'staff',
                        'patientsRegisteredToday' => Patient::whereDate('created_at', $today)->count(),
                        'totalQueuesToday' => (clone $todayQueuesQuery)->count(),
                        'totalWaitingQueuesToday' => (clone $todayQueuesQuery)
                            ->where('status', 'waiting')
                            ->count(),
                        'totalCheckingQueuesToday' => (clone $todayQueuesQuery)
                            ->where('status', 'checking')
                            ->count(),
                        'totalDoneQueuesToday' => (clone $todayQueuesQuery)
                            ->where('status', 'done')
                            ->count(),
                        'totalUnpaidPaymentsToday' => (clone $todayPaymentsQuery)
                            ->where('status', 'unpaid')
                            ->count(),
                        'totalPaidPaymentsToday' => (clone $todayPaymentsQuery)
                            ->where('status', 'paid')
                            ->count(),
                        'incomeToday' => (clone $todayPaymentsQuery)
                            ->where('status', 'paid')
                            ->sum('total_payment'),
                        'totalLowStockMedicines' => Medicine::where('stock', '<=', 10)->count(),
                        'recentQueues' => (clone $todayQueuesQuery)
                            ->with(['patient:id,name', 'doctor:id,name'])
                            ->latest()
                            ->take(5)
                            ->get(),
                        'recentPayments' => (clone $todayPaymentsQuery)
                            ->with(['medicalRecord.patient:id,name'])
                            ->latest()
                            ->take(5)
                            ->get(),
                    ]
                );

            default:
                return Inertia::render(
                    'Dashboard',
                    [
                        'role' => 'admin',
                        'totalPatients' => Patient::count(),
                        'totalDoctors' => Doctor::count(),
                        'totalQueues' => Queue::count(),
                        'totalQueuesToday' => Queue::whereDate('queue_date', $today)->count(),
                        'totalMedicalRecords' => MedicalRecord::count(),
                        'totalMedicines' => Medicine::count(),
                        'totalPrescriptions' => Prescription::count(),
                        'totalPayments' => Payment::count(),
                        'totalIncomePaid' => Payment::where('status', 'paid')->sum('total_payment'),
                        'recentQueues' => Queue::with(['patient:id,name', 'doctor:id,name'])
                            ->latest()
                            ->paginate(5, ['*'], 'recent_queues_page')
                            ->withQueryString(),
                        'recentPayments' => Payment::with(['medicalRecord.patient:id,name'])
                            ->latest()
                            ->paginate(5, ['*'], 'recent_payments_page')
                            ->withQueryString(),
                    ]
                );
        }
    }

    private function doctorProfile(): ?Doctor
    {
        return Doctor::where('user_id', auth()->id())->first();
    }
}
