<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueController extends Controller
{
    public function index()
    {
        $query = Queue::with([
            'patient',
            'doctor'
        ]);

        if (request('status')) {

            $query->where(
                'status',
                request('status')
            );

        }

        $queues = $query
            ->latest()
            ->get();

        return Inertia::render('Queues/Index', [
            'queues' => $queues
        ]);
    }

    public function create()
    {
        $patients = Patient::all();

        $doctors = Doctor::all();

        return Inertia::render('Queues/Create', [
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    public function store(Request $request)
    {
        $latestQueue = Queue::latest()->first();

        $number = 1;

        if ($latestQueue) {
            $number = $latestQueue->id + 1;
        }

        $queueNumber =
            'A' . str_pad($number, 3, '0', STR_PAD_LEFT);

        Queue::create([
            'patient_id' => $request->patient_id,

            'doctor_id' => $request->doctor_id,

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
        $queue->update([
            'status' => $request->status
        ]);

        return redirect()->back();
    }

    public function destroy(
        Queue $queue
    )
    {
        $queue->delete();

        return redirect()->back();
    }
}