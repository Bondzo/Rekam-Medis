import { Head, Link } from '@inertiajs/react';

type Queue = {
    id: number;
    queue_number: string;
    queue_date: string;
    status: string;
    patient?: {
        name: string;
        medical_record_number: string;
    } | null;
    doctor?: {
        name: string;
    } | null;
};

type Props = {
    queue: Queue;
    printedAt: string;
};

const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));

export default function Print({ queue, printedAt }: Props) {
    return (
        <main className="min-h-screen bg-[var(--rm-canvas)] px-4 py-8 text-[var(--rm-ink)]">
            <Head title={`Print Queue ${queue.queue_number}`} />

            <style>{`
                @page {
                    size: 80mm auto;
                    margin: 8mm;
                }

                @media print {
                    body {
                        background: #ffffff !important;
                    }

                    .print-actions {
                        display: none !important;
                    }

                    .queue-ticket {
                        border: 0 !important;
                        width: 100% !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>

            <div className="mx-auto w-full max-w-sm">
                <div className="queue-ticket border border-[var(--rm-hairline)] bg-[var(--rm-surface)] p-6 text-center">
                    <p className="text-sm font-bold uppercase tracking-[1.5px]">
                        Sistem Rekam Medis Klinik
                    </p>
                    <p className="mt-1 text-xs text-[var(--rm-muted)]">
                        Nomor Antrean Pasien
                    </p>

                    <div className="my-6 border-y border-dashed border-[var(--rm-hairline)] py-6">
                        <p className="text-6xl font-bold leading-none">
                            {queue.queue_number}
                        </p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                            {queue.status}
                        </p>
                    </div>

                    <div className="space-y-3 text-left text-sm">
                        <InfoRow label="Nama Pasien" value={queue.patient?.name} />
                        <InfoRow
                            label="MR Number"
                            value={queue.patient?.medical_record_number}
                        />
                        <InfoRow
                            label="Dokter Tujuan"
                            value={
                                queue.doctor?.name
                                    ? `Dr. ${queue.doctor.name}`
                                    : undefined
                            }
                        />
                        <InfoRow
                            label="Tanggal Antrean"
                            value={formatDate(queue.queue_date)}
                        />
                        <InfoRow
                            label="Waktu Cetak"
                            value={formatDateTime(printedAt)}
                        />
                    </div>
                </div>

                <div className="print-actions mt-6 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-xl bg-[var(--rm-action)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-white"
                    >
                        Print
                    </button>
                    <Link
                        href={route('queues.index')}
                        className="rounded-xl border border-[var(--rm-hairline-strong)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-ink)]"
                    >
                        Back
                    </Link>
                </div>
            </div>
        </main>
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex justify-between gap-4 border-b border-[var(--rm-hairline)] pb-2">
            <span className="text-[var(--rm-muted)]">{label}</span>
            <span className="text-right font-semibold">{value || '-'}</span>
        </div>
    );
}
