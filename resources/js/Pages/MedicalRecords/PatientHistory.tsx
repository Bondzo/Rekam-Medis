import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

type MedicalRecord = {
    id: number;
    diagnosis: string;
    medical_treatment: string;
    record_date: string;
    doctor?: {
        name: string;
        specialist?: string | null;
    } | null;
};

type Patient = {
    id: number;
    medical_record_number: string;
    name: string;
    gender?: string | null;
    phone?: string | null;
    address?: string | null;
    medical_records: MedicalRecord[];
};

type Props = {
    patient: Patient;
};

const formatDate = (date: string) =>
    new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));

const truncateText = (value: string, maxLength = 120) => {
    if (!value || value.length <= maxLength) {
        return value || '-';
    }

    return `${value.slice(0, maxLength)}...`;
};

export default function PatientHistory({ patient }: Props) {
    return (
        <DashboardLayout>
            <Head title={`${patient.name} Medical Records`} />

            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--rm-action)]">
                            Medical Records
                        </p>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {patient.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">
                            Complete examination history for this patient
                        </p>
                    </div>

                    <Link
                        href={route('medical-records.index')}
                        className="inline-flex min-h-0 items-center rounded-xl border border-[var(--rm-action)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-action)]"
                    >
                        Back
                    </Link>
                </div>

                <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                        <h2 className="text-lg font-semibold text-[var(--rm-ink)]">
                            Patient Information
                        </h2>
                        <span className="rounded-full border border-[var(--rm-hairline)] bg-[var(--rm-surface-soft)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-ink)]">
                            {patient.medical_record_number}
                        </span>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                Name
                            </p>
                            <p className="mt-1 font-semibold text-[var(--rm-ink)]">{patient.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                Gender
                            </p>
                            <p className="mt-1 text-[var(--rm-ink)]">{patient.gender ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                Phone
                            </p>
                            <p className="mt-1 text-[var(--rm-ink)]">{patient.phone ?? '-'}</p>
                        </div>
                        <div className="lg:col-span-2">
                            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                Address
                            </p>
                            <p className="mt-1 text-[var(--rm-ink)]">{patient.address ?? '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {patient.medical_records.length > 0 ? (
                        patient.medical_records.map((record) => (
                            <div key={record.id} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <span className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--rm-hairline)] bg-[var(--rm-surface-soft)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-ink)]">
                                            {formatDate(record.record_date)}
                                        </span>

                                        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                                    Doctor
                                                </p>
                                                <p className="mt-1 text-[var(--rm-ink)]">
                                                    {record.doctor?.name ? `Dr. ${record.doctor.name}` : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                                    Specialist
                                                </p>
                                                <p className="mt-1 text-[var(--rm-ink)]">
                                                    {record.doctor?.specialist ?? '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                                    Diagnosis
                                                </p>
                                                <p className="mt-1 text-[var(--rm-ink)]">{record.diagnosis}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                                                    Medical Treatment
                                                </p>
                                                <p className="mt-1 text-[var(--rm-ink)]">
                                                    {truncateText(record.medical_treatment)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap gap-2">
                                        <Link
                                            href={route('medical-records.show', record.id)}
                                            className="inline-flex items-center rounded-xl border border-[var(--rm-action)] px-4 py-2 text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-action)]"
                                        >
                                            Detail
                                        </Link>

                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this medical record?')) {
                                                    router.delete(route('medical-records.destroy', record.id));
                                                }
                                            }}
                                            className="inline-flex items-center rounded-xl border border-[var(--rm-accent-red)] bg-[var(--rm-accent-red)] px-4 py-2 text-xs font-bold uppercase tracking-[0.5px] text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-[var(--rm-muted)] dark:border-zinc-800 dark:bg-zinc-900">
                            No medical records found for this patient.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
