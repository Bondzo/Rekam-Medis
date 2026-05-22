import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Medicine = {
    id: number;
    name: string;
    stock: number;
    price: number;
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
};

type PrescriptionItemForm = {
    medicine_id: string;
    dosage: string;
    quantity: string;
};

type PrescriptionForm = {
    medical_record_id: number | string;
    notes: string;
    items: PrescriptionItemForm[];
};

type Props = {
    medicalRecord: MedicalRecord | null;
    medicalRecords: MedicalRecord[];
    medicines: Medicine[];
};

export default function Create({ medicalRecord, medicalRecords, medicines }: Props) {
    const { data, setData, post, processing, errors } = useForm<PrescriptionForm>({
        medical_record_id: medicalRecord?.id || '',
        notes: '',
        items: [
            {
                medicine_id: '',
                dosage: '',
                quantity: '1',
            },
        ],
    });

    const selectedMedicalRecord =
        medicalRecord ??
        medicalRecords.find(
            (record) => record.id === Number(data.medical_record_id)
        );

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                medicine_id: '',
                dosage: '',
                quantity: '1',
            },
        ]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (
        index: number,
        field: keyof PrescriptionItemForm,
        value: string | number
    ) => {
        const newItems = [...data.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };
        setData('items', newItems);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('prescriptions.store'));
    };

    return (
        <DashboardLayout>
            <Head title="Create Prescription" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create Prescription
                        </h1>
                        <p className="text-sm text-gray-500">
                            Add medicines for patient treatment
                        </p>
                    </div>

                    <Link
                        href={route('prescriptions.index')}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Patient
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
                                value={
                                    selectedMedicalRecord?.patient
                                        ?.medical_record_number || ''
                                }
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold">
                            Medicines
                        </label>

                        {data.items.map((item, index) => {
                            const selectedMedicine = medicines.find(
                                (medicine) => medicine.id === Number(item.medicine_id)
                            );

                            const quantity = Number(item.quantity);
                            const subtotal =
                                selectedMedicine && Number.isFinite(quantity) && quantity > 0
                                    ? Number(selectedMedicine.price) * quantity
                                    : 0;

                            return (
                                <div
                                    key={index}
                                    className="mb-4 rounded-lg border p-4"
                                >
                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">
                                                Medicine
                                            </label>
                                            <select
                                                value={item.medicine_id}
                                                onChange={(e) =>
                                                    updateItem(index, 'medicine_id', e.target.value)
                                                }
                                                className="w-full rounded-lg border-gray-300"
                                            >
                                                <option value="">Select medicine</option>
                                                {medicines.map((medicine) => (
                                                    <option
                                                        key={medicine.id}
                                                        value={medicine.id}
                                                    >
                                                        {medicine.name} - Stock: {medicine.stock}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`items.${index}.medicine_id`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors[`items.${index}.medicine_id`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium">
                                                Dosage
                                            </label>
                                            <input
                                                type="text"
                                                value={item.dosage}
                                                onChange={(e) =>
                                                    updateItem(index, 'dosage', e.target.value)
                                                }
                                                placeholder="3x1 setelah makan"
                                                className="w-full rounded-lg border-gray-300"
                                            />
                                            {errors[`items.${index}.dosage`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors[`items.${index}.dosage`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'quantity',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border-gray-300"
                                            />
                                            {errors[`items.${index}.quantity`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors[`items.${index}.quantity`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium">
                                                Subtotal
                                            </label>
                                            <input
                                                type="text"
                                                value={`Rp ${subtotal.toLocaleString('id-ID')}`}
                                                disabled
                                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addItem}
                            className="rounded bg-green-600 px-4 py-2 text-sm text-white"
                        >
                            + Add Medicine
                        </button>

                        {errors.items && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.items}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">
                            Notes
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full rounded-lg border-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Save Prescription
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
