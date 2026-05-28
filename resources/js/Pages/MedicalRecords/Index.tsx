import { Pagination, SearchInput } from '@/Components/IndexControls';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

type Patient = {
    id: number;
    medical_record_number: string;
    name: string;
    gender?: string | null;
    phone?: string | null;
    medical_records_count: number;
};

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

type Paginated<T> = {
    data: T[];
    links: any[];
};

type Props = {
    mode: 'admin' | 'doctor';
    patients?: Paginated<Patient>;
    records?: Paginated<MedicalRecord>;
    filters: {
        search: string;
    };
    auth: {
        user: {
            role: string;
        };
    };
};

function DoctorRecordsTable({
    records,
    auth,
}: {
    records: Paginated<MedicalRecord>;
    auth: Props['auth'];
}) {
    return (
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
                                <td className="px-4 py-3 text-sm">{record.record_date}</td>
                                <td className="px-4 py-3 text-sm">
                                    {record.patient?.medical_record_number ?? '-'}
                                </td>
                                <td className="px-4 py-3 text-sm">{record.patient?.name ?? '-'}</td>
                                <td className="px-4 py-3 text-sm">
                                    {record.doctor?.name ? `Dr. ${record.doctor.name}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm">{record.diagnosis}</td>
                                <td className="px-4 py-3 text-sm">{record.medical_treatment}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex flex-wrap gap-2">
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
                                                        router.delete(route('medical-records.destroy', record.id));
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
                            <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                                No medical records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination links={records.links} />
        </div>
    );
}

function AdminPatientsTable({ patients }: { patients: Paginated<Patient> }) {
    return (
        <div className="rm-table-shell">
            <table className="w-full border-collapse">
                <thead className="rm-table-head">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">MR Number</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
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

export default function Index({ mode, patients, records, filters, auth }: Props) {
    const isAdmin = mode === 'admin';

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
                            {isAdmin
                                ? 'Patients with recorded examination history'
                                : 'Patient examination history'}
                        </p>
                    </div>

                    {!isAdmin && (
                        <Link
                            href={route('medical-records.create')}
                            className="rm-button inline-flex items-center px-5"
                        >
                            Add Record
                        </Link>
                    )}
                </div>

                <div className="mb-4">
                    <SearchInput
                        routeName="/medical-records"
                        placeholder={isAdmin ? 'Search patient...' : 'Search medical record...'}
                        value={filters.search}
                    />
                </div>

                {isAdmin && patients ? (
                    <AdminPatientsTable patients={patients} />
                ) : records ? (
                    <DoctorRecordsTable records={records} auth={auth} />
                ) : null}
            </div>
        </DashboardLayout>
    );
}
