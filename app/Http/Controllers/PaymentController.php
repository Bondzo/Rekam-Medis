<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $payments = Payment::with([
            'medicalRecord.patient',
            'medicalRecord.doctor',
            'medicalRecord.prescription.items.medicine',
        ])
            ->when($search, function ($query) use ($search) {
                $query->where('status', 'like', "%{$search}%")
                    ->orWhere('payment_method', 'like', "%{$search}%")
                    ->orWhereHas('medicalRecord.patient', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('medical_record_number', 'like', "%{$search}%");
                    })
                    ->orWhereHas('medicalRecord.doctor', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $medicalRecord = null;

        if ($request->has('medical_record_id')) {
            $medicalRecord = MedicalRecord::with([
                'patient',
                'doctor',
                'prescription.items.medicine',
            ])->findOrFail($request->medical_record_id);
        }

        $medicalRecords = MedicalRecord::with([
            'patient',
            'doctor',
            'prescription.items.medicine',
        ])
            ->has('prescription')
            ->doesntHave('payment')
            ->latest()
            ->get();

        return Inertia::render('Payments/Create', [
            'medicalRecord' => $medicalRecord,
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medical_record_id' => 'required|exists:medical_records,id',
            'admin_fee' => 'required|numeric|min:0',
            'doctor_fee' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,transfer,qris',
            'payment_date' => 'required|date',
        ]);

        $payment = DB::transaction(function () use ($validated) {
            $medicalRecord = MedicalRecord::with([
                'patient',
                'doctor',
                'prescription.items.medicine',
            ])->lockForUpdate()->findOrFail($validated['medical_record_id']);

            if ($medicalRecord->payment()->exists()) {
                throw ValidationException::withMessages([
                    'medical_record_id' => 'Payment for this medical record already exists.',
                ]);
            }

            if (!$medicalRecord->prescription) {
                throw ValidationException::withMessages([
                    'medical_record_id' => 'Medical record must have a prescription before payment.',
                ]);
            }

            $medicineFee = $medicalRecord->prescription->items->sum(function ($item) {
                return (float) $item->subtotal;
            });

            $adminFee = (float) $validated['admin_fee'];
            $doctorFee = (float) $validated['doctor_fee'];
            $totalPayment = $adminFee + $doctorFee + $medicineFee;

            $payment = Payment::create([
                'medical_record_id' => $medicalRecord->id,
                'admin_fee' => $adminFee,
                'doctor_fee' => $doctorFee,
                'medicine_fee' => $medicineFee,
                'total_payment' => $totalPayment,
                'payment_method' => $validated['payment_method'],
                'payment_date' => $validated['payment_date'],
                'status' => 'unpaid',
            ]);

            if (in_array($validated['payment_method'], ['transfer', 'qris'], true)) {
                $payment->update([
                    'midtrans_order_id' => 'PAY-'.$payment->id.'-'.now()->timestamp,
                ]);

                $payment->update([
                    'snap_token' => $this->createSnapToken($payment, $medicalRecord),
                ]);
            }

            return $payment;
        });

        return redirect()
            ->route('payments.show', $payment)
            ->with('success', 'Payment created successfully.');
    }

    public function show(Payment $payment)
    {
        $payment->load([
            'medicalRecord.patient',
            'medicalRecord.doctor',
            'medicalRecord.prescription.items.medicine',
        ]);

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    public function confirm(Payment $payment)
    {
        if (!in_array(auth()->user()->role, ['admin', 'staff'], true)) {
            abort(403);
        }

        if ($payment->status === 'unpaid') {
            $payment->update([
                'status' => 'paid',
            ]);
        }

        return redirect()
            ->route('payments.success', $payment)
            ->with('success', 'Pembayaran berhasil dikonfirmasi');
    }

    public function success(Payment $payment)
    {
        if (!in_array(auth()->user()->role, ['admin', 'staff'], true)) {
            abort(403);
        }

        $payment->load([
            'medicalRecord.patient',
            'medicalRecord.doctor',
        ]);

        return Inertia::render('Payments/Success', [
            'payment' => $payment,
        ]);
    }

    public function callback(Request $request)
    {
        $serverKey = config('midtrans.server_key');

        if (!$serverKey) {
            abort(500, 'Midtrans server key is not configured.');
        }

        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');
        $signatureKey = $request->input('signature_key');

        if (!$orderId) {
            abort(422, 'Missing Midtrans order id.');
        }

        if ($signatureKey) {
            $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

            if (!hash_equals($expectedSignature, $signatureKey)) {
                abort(403, 'Invalid Midtrans signature.');
            }
        }

        $payment = Payment::where('midtrans_order_id', $orderId)->firstOrFail();
        $transactionStatus = $request->input('transaction_status');
        $fraudStatus = $request->input('fraud_status');

        if ($transactionStatus === 'settlement' ||
            ($transactionStatus === 'capture' && $fraudStatus === 'accept')) {
            $payment->update(['status' => 'paid']);
        }

        if (in_array($transactionStatus, ['pending', 'expire', 'cancel', 'deny'], true)) {
            // TODO: Add a failed status column if the payment lifecycle needs to distinguish failed payments.
            $payment->update(['status' => 'unpaid']);
        }

        return response()->json(['message' => 'Notification processed.']);
    }

    private function createSnapToken(Payment $payment, MedicalRecord $medicalRecord): string
    {
        $serverKey = config('midtrans.server_key');

        if (!$serverKey) {
            throw ValidationException::withMessages([
                'payment_method' => 'Midtrans server key is not configured.',
            ]);
        }

        Config::$serverKey = $serverKey;
        Config::$isProduction = (bool) config('midtrans.is_production');
        Config::$isSanitized = (bool) config('midtrans.is_sanitized');
        Config::$is3ds = (bool) config('midtrans.is_3ds');

        return Snap::getSnapToken([
            'transaction_details' => [
                'order_id' => $payment->midtrans_order_id,
                'gross_amount' => (int) round($payment->total_payment),
            ],
            'customer_details' => [
                'first_name' => $medicalRecord->patient?->name,
                'phone' => $medicalRecord->patient?->phone,
            ],
            'item_details' => [
                [
                    'id' => 'payment-'.$payment->id,
                    'price' => (int) round($payment->total_payment),
                    'quantity' => 1,
                    'name' => 'Clinic payment',
                ],
            ],
        ]);
    }
}
