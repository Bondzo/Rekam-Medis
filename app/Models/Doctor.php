<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'specialist',
        'phone',
        'address',
    ];

    public function user()
        {
            return $this->belongsTo(User::class);
        }

    public function medicalRecords()
        {
            return $this->hasMany(MedicalRecord::class);
        }
}
