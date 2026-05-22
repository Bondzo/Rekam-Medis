<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'queue_id',
        'complaint',
        'physical_examination',
        'diagnosis',
        'medical_treatment',
        'record_date',
        'notes',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }

    public function prescription()
    {
        return $this->hasOne(Prescription::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
