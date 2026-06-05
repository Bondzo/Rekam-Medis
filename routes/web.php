<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\StaffController;
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

    Route::resource(
        'staff',
        StaffController::class
    )->except([
        'show',
    ]);

});

Route::middleware([
    'auth',
    'role:admin,staff'
])->group(function () {

    Route::get(
        '/queues/{queue}/print',
        [QueueController::class, 'print']
    )->name('queues.print');

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
    'role:admin,doctor,staff'
])->group(function () {

    Route::get(
        '/medical-records/patients/{patient}',
        [MedicalRecordController::class, 'patientHistory']
    )->name('medical-records.patient-history');

    Route::get(
        '/medical-records',
        [MedicalRecordController::class, 'index']
    )->name('medical-records.index');

});

// Authorization restore: Medical Records must be accessible to admin, staff, and doctor.
Route::middleware([
    'auth',
    'role:admin,staff,doctor'
])->group(function () {

    Route::get(
        '/medical-records/create',
        [MedicalRecordController::class, 'create']
    )->name('medical-records.create');

    Route::post(
        '/medical-records',
        [MedicalRecordController::class, 'store']
    )->name('medical-records.store');

    Route::get(
        '/medical-records/{medicalRecord}/edit',
        [MedicalRecordController::class, 'edit']
    )->name('medical-records.edit');

    Route::put(
        '/medical-records/{medicalRecord}',
        [MedicalRecordController::class, 'update']
    )->name('medical-records.update');

    Route::patch(
        '/medical-records/{medicalRecord}',
        [MedicalRecordController::class, 'update']
    );

});

Route::middleware([
    'auth',
    'role:admin,doctor,staff'
])->group(function () {

    Route::get(
        '/medical-records/{medicalRecord}',
        [MedicalRecordController::class, 'show']
    )->name('medical-records.show');

});

Route::middleware([
    'auth',
    'role:admin'
])->group(function () {

    Route::delete(
        '/medical-records/{medicalRecord}',
        [MedicalRecordController::class, 'destroy']
    )->name('medical-records.destroy');

});

Route::middleware([
    'auth',
    'role:admin,staff'
])->group(function () {

    Route::resource(
        'medicines',
        MedicineController::class
    );

    Route::put(
        '/payments/{payment}/confirm',
        [PaymentController::class, 'confirm']
    )->name('payments.confirm');

    Route::put(
        '/payments/{payment}/mark-paid',
        [PaymentController::class, 'markPaid']
    )->name('payments.mark-paid');

    Route::get(
        '/payments/{payment}/success',
        [PaymentController::class, 'success']
    )->name('payments.success');

    Route::get(
        '/payments/{payment}/print',
        [PaymentController::class, 'print']
    )->name('payments.print');

    Route::get(
        '/payments/{payment}/invoice-pdf',
        [PaymentController::class, 'invoicePdf']
    )->name('payments.invoice-pdf');

    Route::resource(
        'payments',
        PaymentController::class
    )->only([
        'index',
        'create',
        'store',
        'show',
    ]);

});

Route::post(
    '/midtrans/callback',
    [PaymentController::class, 'callback']
)->name('midtrans.callback');

// Authorization restore: Prescriptions are available for admin, staff, and doctor.
Route::middleware([
    'auth',
    'role:admin,staff,doctor'
])->group(function () {

    Route::resource(
        'prescriptions',
        PrescriptionController::class
    )->only([
        'index',
        'create',
        'store',
    ]);

});

require __DIR__.'/auth.php';
