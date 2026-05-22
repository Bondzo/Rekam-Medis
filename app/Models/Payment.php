<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'medical_record_id',
        'admin_fee',
        'doctor_fee',
        'medicine_fee',
        'total_payment',
        'payment_method',
        'payment_date',
        'status',
        'snap_token',
        'midtrans_order_id',
    ];

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}
