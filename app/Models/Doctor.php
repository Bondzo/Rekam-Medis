<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'name',
        'specialist',
        'phone',
        'address',
    ];

    public function medicalRecords()
        {
            return $this->hasMany(MedicalRecord::class);
        }
}