import DashboardLayout from '@/Layouts/DashboardLayout';
import { Pagination, SearchInput } from '@/Components/IndexControls';
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
    records: {
        data: MedicalRecord[];
        links: any[];
    };
    filters: {
        search: string;
    };
    auth: {
        user: {
            role: string;
        };
    };
};
export default function Index({ records, filters, auth }: Props) {
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
                        className="rm-button inline-flex items-center px-5"
                    >
                        Add Record
                    </Link>
 
                </div>

                <div className="mb-4">
                    <SearchInput routeName="/medical-records" placeholder="Search medical record..." value={filters.search} />
                </div>

                <div className="rm-table-shell">
                    <table className="w-full border-collapse">
                        <thead className="rm-table-head">
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
                            {records.data.length > 0 ? (
                                records.data.map((record) => (
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
                                                    className="rm-button-outline inline-flex min-h-10 items-center px-4 text-xs"
                                                >
                                                    Detail
                                                </Link>

                                                <Link
                                                    href={route('medical-records.edit', record.id)}
                                                    className="rm-button inline-flex min-h-10 items-center px-4 text-xs"
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
                                                        className="rm-button rm-button-danger min-h-10 px-4 text-xs"
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
                                        colSpan={7}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No medical records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination links={records.links} />
                </div>
            </div>
        </DashboardLayout>
    );
}
