<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Invoice #{{ $payment->id }}</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            color: #262626;
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            margin: 0;
        }

        .header {
            border-bottom: 2px solid #1c69d4;
            padding-bottom: 16px;
        }

        .brand {
            color: #1c69d4;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        h1 {
            font-size: 24px;
            margin: 8px 0 4px;
        }

        h2 {
            font-size: 14px;
            margin: 24px 0 10px;
            text-transform: uppercase;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 1px solid #e6e6e6;
            padding: 8px;
            vertical-align: top;
        }

        th {
            background: #f7f7f7;
            text-align: left;
        }

        .grid {
            margin-top: 18px;
            width: 100%;
        }

        .grid td {
            border: 0;
            padding: 4px 0;
            width: 50%;
        }

        .label {
            color: #6b6b6b;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .value {
            font-weight: 700;
            margin-top: 2px;
        }

        .right {
            text-align: right;
        }

        .summary {
            margin-left: auto;
            margin-top: 18px;
            width: 45%;
        }

        .summary td {
            border: 0;
            border-bottom: 1px solid #e6e6e6;
        }

        .total td {
            border-bottom: 0;
            font-size: 16px;
            font-weight: 700;
        }
    </style>
</head>
<body>
@php
    $record = $payment->medicalRecord;
    $patient = $record?->patient;
    $doctor = $record?->doctor;
    $items = $record?->prescription?->items ?? collect();
    $money = fn ($value) => 'Rp '.number_format((float) $value, 0, ',', '.');
@endphp

<div class="header">
    <div class="brand">Sistem Rekam Medis Klinik</div>
    <h1>Payment Invoice</h1>
    <div>Invoice ID: #{{ $payment->id }}</div>
    <div>Generated: {{ $generatedAt->format('d M Y H:i') }}</div>
</div>

<table class="grid">
    <tr>
        <td>
            <div class="label">Patient</div>
            <div class="value">{{ $patient?->name ?? '-' }}</div>
        </td>
        <td>
            <div class="label">MR Number</div>
            <div class="value">{{ $patient?->medical_record_number ?? '-' }}</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="label">Doctor</div>
            <div class="value">{{ $doctor?->name ? 'Dr. '.$doctor->name : '-' }}</div>
        </td>
        <td>
            <div class="label">Payment Date</div>
            <div class="value">{{ $payment->payment_date }}</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="label">Payment Method</div>
            <div class="value">{{ $payment->payment_method }}</div>
        </td>
        <td>
            <div class="label">Payment Status</div>
            <div class="value">{{ strtoupper($payment->status) }}</div>
        </td>
    </tr>
</table>

<h2>Medicine List</h2>
<table>
    <thead>
    <tr>
        <th>Medicine</th>
        <th>Dosage</th>
        <th class="right">Qty</th>
        <th class="right">Subtotal</th>
    </tr>
    </thead>
    <tbody>
    @forelse ($items as $item)
        <tr>
            <td>{{ $item->medicine?->name ?? '-' }}</td>
            <td>{{ $item->dosage }}</td>
            <td class="right">{{ $item->quantity }}</td>
            <td class="right">{{ $money($item->subtotal) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="4" class="right">No medicine data.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<table class="summary">
    <tr>
        <td>Medicine Fee</td>
        <td class="right">{{ $money($payment->medicine_fee) }}</td>
    </tr>
    <tr>
        <td>Admin Fee</td>
        <td class="right">{{ $money($payment->admin_fee) }}</td>
    </tr>
    <tr>
        <td>Doctor Fee</td>
        <td class="right">{{ $money($payment->doctor_fee) }}</td>
    </tr>
    <tr class="total">
        <td>Total Payment</td>
        <td class="right">{{ $money($payment->total_payment) }}</td>
    </tr>
</table>
</body>
</html>
