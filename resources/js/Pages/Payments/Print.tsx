import { Head, Link } from '@inertiajs/react';

type PrescriptionItem = {
    id: number;
    dosage: string;
    quantity: number;
    subtotal: number | string;
    medicine?: {
        name: string;
    } | null;
};

type Payment = {
    id: number;
    admin_fee: number | string;
    doctor_fee: number | string;
    medicine_fee: number | string;
    total_payment: number | string;
    payment_method: string;
    payment_date: string;
    status: string;
    medical_record?: {
        patient?: {
            name: string;
            medical_record_number: string;
        } | null;
        doctor?: {
            name: string;
        } | null;
        prescription?: {
            items: PrescriptionItem[];
        } | null;
    } | null;
};

type Props = {
    payment: Payment;
    printedAt: string;
};

const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

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

export default function Print({ payment, printedAt }: Props) {
    const items = payment.medical_record?.prescription?.items ?? [];

    return (
        <main className="min-h-screen bg-[var(--rm-canvas)] px-4 py-8 text-[var(--rm-ink)]">
            <Head title={`Payment Receipt #${payment.id}`} />

            <style>{`
                @page {
                    size: A4;
                    margin: 14mm;
                }

                @media print {
                    body {
                        background: #ffffff !important;
                    }

                    .print-actions {
                        display: none !important;
                    }

                    .receipt {
                        border: 0 !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>

            <div className="mx-auto w-full max-w-3xl">
                <div className="receipt border border-[var(--rm-hairline)] bg-[var(--rm-surface)] p-6">
                    <div className="border-b border-[var(--rm-hairline)] pb-5">
                        <p className="text-sm font-bold uppercase tracking-[1.5px] text-[var(--rm-action)]">
                            Sistem Rekam Medis Klinik
                        </p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Struk Pembayaran</h1>
                                <p className="text-sm text-[var(--rm-muted)]">
                                    Invoice / Payment ID: #{payment.id}
                                </p>
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-[0.5px]">
                                {payment.status}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 border-b border-[var(--rm-hairline)] py-5 text-sm sm:grid-cols-2">
                        <InfoItem
                            label="Nama Pasien"
                            value={payment.medical_record?.patient?.name}
                        />
                        <InfoItem
                            label="MR Number"
                            value={payment.medical_record?.patient?.medical_record_number}
                        />
                        <InfoItem
                            label="Dokter"
                            value={
                                payment.medical_record?.doctor?.name
                                    ? `Dr. ${payment.medical_record.doctor.name}`
                                    : undefined
                            }
                        />
                        <InfoItem
                            label="Tanggal Pembayaran"
                            value={formatDate(payment.payment_date)}
                        />
                        <InfoItem
                            label="Metode Pembayaran"
                            value={payment.payment_method}
                        />
                        <InfoItem
                            label="Waktu Cetak"
                            value={formatDateTime(printedAt)}
                        />
                    </div>

                    <div className="py-5">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.5px]">
                            Daftar Obat
                        </h2>
                        <div className="overflow-hidden border border-[var(--rm-hairline)]">
                            <table className="w-full border-collapse text-sm">
                                <thead className="bg-[var(--rm-surface-soft)]">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Medicine</th>
                                        <th className="px-3 py-2 text-left">Dosage</th>
                                        <th className="px-3 py-2 text-right">Qty</th>
                                        <th className="px-3 py-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-t border-[var(--rm-hairline)]"
                                            >
                                                <td className="px-3 py-2">
                                                    {item.medicine?.name ?? '-'}
                                                </td>
                                                <td className="px-3 py-2">{item.dosage}</td>
                                                <td className="px-3 py-2 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    {formatCurrency(item.subtotal)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-3 py-4 text-center text-[var(--rm-muted)]"
                                            >
                                                Tidak ada data obat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="ml-auto w-full max-w-sm space-y-2 border-t border-[var(--rm-hairline)] pt-5 text-sm">
                        <FeeRow label="Medicine Fee" value={payment.medicine_fee} />
                        <FeeRow label="Admin Fee" value={payment.admin_fee} />
                        <FeeRow label="Doctor Fee" value={payment.doctor_fee} />
                        <div className="flex justify-between border-t border-[var(--rm-hairline)] pt-3 text-lg font-bold">
                            <span>Total Payment</span>
                            <span>{formatCurrency(payment.total_payment)}</span>
                        </div>
                    </div>
                </div>

                <div className="print-actions mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-xl bg-[var(--rm-action)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-white"
                    >
                        Print
                    </button>
                    <Link
                        href={route('payments.show', payment.id)}
                        className="rounded-xl border border-[var(--rm-hairline-strong)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-ink)]"
                    >
                        Back
                    </Link>
                </div>
            </div>
        </main>
    );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                {label}
            </p>
            <p className="mt-1 font-semibold">{value || '-'}</p>
        </div>
    );
}

function FeeRow({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <span>{formatCurrency(value)}</span>
        </div>
    );
}
