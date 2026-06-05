import { Pagination, SearchInput } from '@/Components/IndexControls';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

type Patient = {
    id: number;
    medical_record_number: string;
    name: string;
    gender?: string | null;
    phone?: string | null;
    medical_records_count: number;
};

type Paginated<T> = {
    data: T[];
    links: any[];
};

type Props = {
    patients: Paginated<Patient>;
    filters: {
        search: string;
    };
    todayOnly?: boolean;
};

function PatientsTable({ patients }: { patients: Paginated<Patient> }) {
    return (
        <div className="rm-table-shell">
            <table className="w-full border-collapse">
                <thead className="rm-table-head">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">MR Number</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Patient Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Total Records</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.data.length > 0 ? (
                        patients.data.map((patient) => (
                            <tr key={patient.id} className="border-t">
                                <td className="px-4 py-3 text-sm font-semibold text-[var(--rm-ink)]">
                                    {patient.medical_record_number}
                                </td>
                                <td className="px-4 py-3 text-sm">{patient.name}</td>
                                <td className="px-4 py-3 text-sm">{patient.gender ?? '-'}</td>
                                <td className="px-4 py-3 text-sm">{patient.phone ?? '-'}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rm-hairline)] bg-[var(--rm-surface-soft)] text-sm font-bold leading-none text-[var(--rm-ink)]">
                                        {patient.medical_records_count}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <Link
                                        href={route('medical-records.patient-history', patient.id)}
                                        className="rm-button-outline inline-flex min-h-10 items-center px-4 text-xs"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                                No patients with medical records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination links={patients.links} />
        </div>
    );
}

export default function Index({ patients, filters, todayOnly = false }: Props) {
    return (
        <DashboardLayout>
            <Head title="Medical Records" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Medical Records
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">
                            Patients with recorded examination history
                        </p>
                    </div>
                </div>

                {todayOnly && (
                    <div className="mb-4 inline-flex border border-[var(--rm-hairline)] bg-[var(--rm-surface-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                        Menampilkan data hari ini
                    </div>
                )}

                <div className="mb-4">
                    <SearchInput
                        routeName="/medical-records"
                        placeholder="Search patient..."
                        value={filters.search}
                    />
                </div>

                <PatientsTable patients={patients} />
            </div>
        </DashboardLayout>
    );
}
