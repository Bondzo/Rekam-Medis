import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

type Record = {
    id: number;
    complaint: string;
    physical_examination: string;
    diagnosis: string;
    medical_treatment: string;
    record_date: string;
    notes?: string | null;
    patient?: {
        id: number;
        name: string;
        medical_record_number: string;
        gender: string;
        phone: string;
        address: string;
    };
    doctor?: {
        name: string;
        specialist: string;
    };
};

type Props = {
    record: Record;
};

const formatDate = (date: string) =>
    new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));

function InfoItem({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            <p className="mt-1.5 text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                {value || '-'}
            </p>
        </div>
    );
}

function TextSection({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                {value || '-'}
            </p>
        </div>
    );
}

export default function Show({ record }: Props) {
    return (
        <DashboardLayout>
            <Head title="Medical Record Detail" />

            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--rm-action)]">
                            Medical Records
                        </p>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            Medical Record Detail
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                            Complete patient examination information
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('prescriptions.create', {
                                medical_record_id: record.id,
                            })}
                            className="inline-flex items-center rounded-xl border border-[#178a4b] bg-[#178a4b] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-white"
                        >
                            Create Prescription
                        </Link>

                        <Link
                            href={route('medical-records.index')}
                            className="inline-flex items-center rounded-xl border border-[var(--rm-action)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-action)]"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                <div className="grid gap-5">
                    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-5 flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                Patient Information
                            </h2>
                            <span className="inline-flex w-fit items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.6px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                                {record.patient?.medical_record_number ?? '-'}
                            </span>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoItem label="Name" value={record.patient?.name} />
                            <InfoItem label="Gender" value={record.patient?.gender} />
                            <InfoItem label="Phone" value={record.patient?.phone} />
                            <div className="sm:col-span-2 lg:col-span-3">
                                <InfoItem label="Address" value={record.patient?.address} />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-5 flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                Examination
                            </h2>
                            <span className="inline-flex w-fit items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.6px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                                {formatDate(record.record_date)}
                            </span>
                        </div>

                        <div className="grid gap-5">
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <InfoItem
                                    label="Doctor"
                                    value={record.doctor?.name ? `Dr. ${record.doctor.name}` : '-'}
                                />
                                <InfoItem label="Specialist" value={record.doctor?.specialist} />
                                <InfoItem label="Date" value={formatDate(record.record_date)} />
                            </div>

                            <TextSection label="Complaint" value={record.complaint} />
                            <TextSection
                                label="Physical Examination"
                                value={record.physical_examination}
                            />
                            <TextSection label="Diagnosis" value={record.diagnosis} />
                            <TextSection label="Medical Treatment" value={record.medical_treatment} />
                            <TextSection label="Notes" value={record.notes} />
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
