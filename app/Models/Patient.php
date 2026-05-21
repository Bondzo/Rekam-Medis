<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
    'medical_record_number',
    'nik',
    'name',
    'gender',
    'birth_date',
    'phone',
    'address',
];

    public function medicalRecords()
        {
            return $this->hasMany(MedicalRecord::class);
        }
}
