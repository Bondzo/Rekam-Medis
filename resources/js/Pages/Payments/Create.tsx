import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type PrescriptionItem = {
    id: number;
    dosage: string;
    quantity: number;
    subtotal: number;
    medicine?: {
        name: string;
        unit: string;
    };
};

type MedicalRecord = {
    id: number;
    patient?: {
        name: string;
        medical_record_number: string;
    };
    doctor?: {
        name: string;
    };
    prescription?: {
        items: PrescriptionItem[];
    };
};

type PaymentForm = {
    medical_record_id: number | string;
    admin_fee: string;
    doctor_fee: string;
    payment_method: string;
    payment_date: string;
};

type Props = {
    medicalRecord: MedicalRecord | null;
    medicalRecords: MedicalRecord[];
};

export default function Create({ medicalRecord, medicalRecords }: Props) {
    const { data, setData, post, processing, errors } = useForm<PaymentForm>({
        medical_record_id: medicalRecord?.id || '',
        admin_fee: '0',
        doctor_fee: '0',
        payment_method: 'cash',
        payment_date: new Date().toISOString().slice(0, 10),
    });

    const selectedMedicalRecord =
        medicalRecord ??
        medicalRecords.find(
            (record) => record.id === Number(data.medical_record_id)
        );

    const prescriptionItems = selectedMedicalRecord?.prescription?.items ?? [];

    const medicineFee = prescriptionItems.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0
    );
    const adminFee = Number(data.admin_fee);
    const doctorFee = Number(data.doctor_fee);
    const totalPayment =
        (Number.isFinite(adminFee) ? adminFee : 0) +
        (Number.isFinite(doctorFee) ? doctorFee : 0) +
        medicineFee;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <DashboardLayout>
            <Head title="Create Payment" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create Payment
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create invoice from prescription items
                        </p>
                    </div>

                    <Link
                        href={route('payments.index')}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Medical Record
                            </label>
                            {medicalRecord ? (
                                <input
                                    type="text"
                                    value={medicalRecord.patient?.name || ''}
                                    disabled
                                    className="w-full rounded-lg border-gray-300 bg-gray-100"
                                />
                            ) : (
                                <select
                                    value={data.medical_record_id}
                                    onChange={(e) =>
                                        setData('medical_record_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="">Select medical record</option>
                                    {medicalRecords.map((record) => (
                                        <option key={record.id} value={record.id}>
                                            {record.patient?.medical_record_number} -{' '}
                                            {record.patient?.name} - Dr.{' '}
                                            {record.doctor?.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.medical_record_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.medical_record_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                MR Number
                            </label>
                            <input
                                type="text"
                                value={selectedMedicalRecord?.patient?.medical_record_number || ''}
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Doctor
                            </label>
                            <input
                                type="text"
                                value={
                                    selectedMedicalRecord?.doctor?.name
                                        ? `Dr. ${selectedMedicalRecord.doctor.name}`
                                        : ''
                                }
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="mb-3 text-lg font-semibold">
                            Prescription Items
                        </h2>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Medicine</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Dosage</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Qty</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescriptionItems.length > 0 ? (
                                        prescriptionItems.map((item) => (
                                            <tr key={item.id} className="border-t">
                                                <td className="px-4 py-3 text-sm">
                                                    {item.medicine?.name ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">{item.dosage}</td>
                                                <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-6 text-center text-sm text-gray-500"
                                            >
                                                Select a medical record to show prescription items.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-5 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Medicine Fee
                            </label>
                            <input
                                type="text"
                                value={`Rp ${medicineFee.toLocaleString('id-ID')}`}
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Admin Fee
                            </label>
                            <input
                                type="number"
                                value={data.admin_fee}
                                onChange={(e) => setData('admin_fee', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.admin_fee && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.admin_fee}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Doctor Fee
                            </label>
                            <input
                                type="number"
                                value={data.doctor_fee}
                                onChange={(e) => setData('doctor_fee', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.doctor_fee && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.doctor_fee}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Payment Date
                            </label>
                            <input
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.payment_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.payment_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Payment Method
                            </label>
                            <select
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="cash">Cash</option>
                                <option value="transfer">Transfer</option>
                                <option value="qris">QRIS</option>
                            </select>
                            {errors.payment_method && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.payment_method}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6 rounded-lg bg-gray-100 p-4">
                        <p className="text-sm text-gray-500">Total Payment</p>
                        <p className="text-2xl font-bold text-gray-800">
                            Rp {totalPayment.toLocaleString('id-ID')}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Save Payment
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
