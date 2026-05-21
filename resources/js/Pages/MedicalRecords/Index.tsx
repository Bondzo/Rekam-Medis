import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

type MedicalRecord = {
    id: number;
    complaint: string;
    diagnosis: string;
    medical_treatment: string;
    record_date: string;
    patient?: {
        name: string;
        medical_record_number: string;
    };
    doctor?: {
        name: string;
    };
};

type Props = {
    records: MedicalRecord[];
    auth: {
        user: {
            role: string;
        };
    };
};
export default function Index({ records, auth }: Props) {
    return (
        <DashboardLayout>
            <Head title="Medical Records" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Medical Records
                        </h1>
                        <p className="text-sm text-gray-500">
                            Patient examination history
                        </p>
                    </div>

                    <Link
                        href={route('medical-records.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Add Record
                    </Link>
 
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">MR Number</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Patient</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Doctor</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Diagnosis</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Treatment</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>

                            </tr>
                        </thead>

                        <tbody>
                            {records.length > 0 ? (
                                records.map((record) => (
                                    <tr key={record.id} className="border-t">
                                        <td className="px-4 py-3 text-sm">
                                            {record.record_date}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {record.patient?.medical_record_number ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {record.patient?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {record.doctor?.name
                                                ? `Dr. ${record.doctor.name}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {record.diagnosis}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {record.medical_treatment}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex gap-2">

                                                <Link
                                                    href={route('medical-records.show', record.id)}
                                                    className="rounded bg-gray-700 px-3 py-1 text-white"
                                                >
                                                    Detail
                                                </Link>

                                                <Link
                                                    href={route('medical-records.edit', record.id)}
                                                    className="rounded bg-yellow-500 px-3 py-1 text-black"
                                                >
                                                    Edit
                                                </Link>

                                                {auth.user.role === 'admin' && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Delete this medical record?')) {
                                                                router.delete(
                                                                    route('medical-records.destroy', record.id)
                                                                );
                                                            }
                                                        }}
                                                        className="rounded bg-red-600 px-3 py-1 text-white"
                                                    >
                                                        Delete
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No medical records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}