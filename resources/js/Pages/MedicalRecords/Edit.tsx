import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';

type Record = {
    id: number;
    complaint: string;
    physical_examination: string;
    diagnosis: string;
    medical_treatment: string;
    record_date: string;
    notes?: string | null;
    patient?: {
        name: string;
        medical_record_number: string;
    };
    doctor?: {
        name: string;
    };
};

export default function Edit({ record }: { record: Record }) {
    const { data, setData, put, processing, errors } = useForm({
        complaint: record.complaint,
        physical_examination: record.physical_examination,
        diagnosis: record.diagnosis,
        medical_treatment: record.medical_treatment,
        record_date: record.record_date,
        notes: record.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('medical-records.update', record.id));
    };

    return (
        <DashboardLayout>
            <Head title="Edit Medical Record" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Medical Record
                        </h1>
                        <p className="text-sm text-gray-500">
                            Update patient examination data
                        </p>
                    </div>

                    <Link
                        href={route('medical-records.index')}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                    <div className="mb-6 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Patient</label>
                            <input
                                type="text"
                                value={record.patient?.name ?? ''}
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">MR Number</label>
                            <input
                                type="text"
                                value={record.patient?.medical_record_number ?? ''}
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>
                    </div>

                    {[
                        ['complaint', 'Complaint'],
                        ['physical_examination', 'Physical Examination'],
                        ['diagnosis', 'Diagnosis'],
                        ['medical_treatment', 'Medical Treatment'],
                        ['notes', 'Notes'],
                    ].map(([field, label]) => (
                        <div className="mb-4" key={field}>
                            <label className="mb-1 block text-sm font-medium">
                                {label}
                            </label>
                            <textarea
                                value={(data as any)[field]}
                                placeholder={`Isi ${label.toLowerCase()}`}
                                onChange={(e) => setData(field as any, e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {(errors as any)[field] && (
                                <p className="mt-1 text-sm text-red-500">
                                    {(errors as any)[field]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">
                            Record Date
                        </label>
                        <input
                            type="date"
                            value={data.record_date}
                            onChange={(e) => setData('record_date', e.target.value)}
                            className="w-full rounded-lg border-gray-300"
                        />
                        {errors.record_date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.record_date}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('medical-records.index')}
                            className="rounded-lg bg-gray-700 px-5 py-2 text-white"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Update Medical Record
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
