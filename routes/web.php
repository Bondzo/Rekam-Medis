<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\PrescriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get(
    '/dashboard',
    [DashboardController::class, 'index']
)->middleware([
    'auth',
    'verified'
])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware([
    'auth',
    'role:admin,staff'
])->group(function () {

    Route::resource(
        'patients',
        PatientController::class
    );

});

Route::middleware([
    'auth',
    'role:admin'
])->group(function () {

    Route::resource(
        'doctors',
        DoctorController::class
    );

});

Route::middleware([
    'auth',
    'role:admin,staff,doctor'
])->group(function () {

    Route::resource(
        'queues',
        QueueController::class
    );

    Route::put(
        '/queues/{queue}/status',
        [QueueController::class, 'updateStatus']
    )->name('queues.updateStatus');

});

Route::middleware([
    'auth',
    'role:admin,doctor'
])->group(function () {

    Route::resource(
        'medical-records',
        MedicalRecordController::class
    );

});

Route::middleware([
    'auth',
    'role:admin,staff'
])->group(function () {

    Route::resource(
        'medicines',
        MedicineController::class
    );

});

Route::middleware([
    'auth',
    'role:admin,doctor'
])->group(function () {

    Route::resource(
        'prescriptions',
        PrescriptionController::class
    )->only([
        'index',
        'create',
        'store',
        'show',
    ]);

});

require __DIR__.'/auth.php';
