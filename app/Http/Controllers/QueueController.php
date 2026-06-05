<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Patient;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $user = auth()->user();
        $today = Carbon::today();
        $doctorProfile = $user->role === 'doctor'
            ? $this->doctorProfile()
            : null;

        $query = Queue::with([
            'patient',
            'doctor'
        ]);

        if ($user->role !== 'admin') {
            $query->whereDate('queue_date', $today);
        }

        if ($user->role === 'doctor') {
            if ($doctorProfile) {
                $query->where('doctor_id', $doctorProfile->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if ($status) {

            $query->where(
                'status',
                $status
            );

        }

        $query->when($search, function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('queue_number', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('doctor', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            });
        });

        $queues = $query
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Queues/Index', [
            'queues' => $queues,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'todayOnly' => $user->role !== 'admin',
            'doctorProfileMissing' => $user->role === 'doctor' && !$doctorProfile,
        ]);
    }

    public function create()
    {
        $patients = Patient::select('id', 'name', 'medical_record_number')
            ->orderBy('name')
            ->get();

        $doctors = Doctor::select('id', 'name', 'specialist')
            ->orderBy('name')
            ->get();

        return Inertia::render('Queues/Create', [
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
        ]);

        $latestQueue = Queue::latest()->first();

        $number = 1;

        if ($latestQueue) {
            $number = $latestQueue->id + 1;
        }

        $queueNumber =
            'A' . str_pad($number, 3, '0', STR_PAD_LEFT);

        Queue::create([
            'patient_id' => $validated['patient_id'],

            'doctor_id' => $validated['doctor_id'],

            'queue_number' => $queueNumber,

            'queue_date' => now(),

            'status' => 'waiting',
        ]);

        return redirect()->route('queues.index');
    }

    public function updateStatus(
        Request $request,
        Queue $queue
    )
    {
        $this->authorizeOperationalQueue($queue);

        $queue->update([
            'status' => $request->status
        ]);

        return redirect()->back();
    }

    public function print(Queue $queue)
    {
        if (!in_array(auth()->user()->role, ['admin', 'staff'], true)) {
            abort(403);
        }

        $this->authorizeOperationalQueue($queue);

        $queue->load([
            'patient',
            'doctor',
        ]);

        return Inertia::render('Queues/Print', [
            'queue' => $queue,
            'printedAt' => now()->toDateTimeString(),
        ]);
    }

    public function destroy(
        Queue $queue
    )
    {
        $this->authorizeOperationalQueue($queue);

        $queue->delete();

        return redirect()->back();
    }

    private function authorizeOperationalQueue(Queue $queue): void
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return;
        }

        if (!Carbon::parse($queue->queue_date)->isSameDay(Carbon::today())) {
            abort(403);
        }

        if ($user->role === 'doctor') {
            $doctor = $this->doctorProfile();

            if (!$doctor || $queue->doctor_id !== $doctor->id) {
                abort(403);
            }
        }
    }

    private function doctorProfile(): ?Doctor
    {
        return Doctor::where('user_id', auth()->id())->first();
    }
}
