import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, FileText, ListChecks } from 'lucide-react';
import { useEffect, useState } from 'react';

type Payment = {
    id: number;
    total_payment: number;
    payment_method: string;
    payment_date: string;
    status: 'unpaid' | 'paid';
    medical_record?: {
        patient?: {
            name: string;
            medical_record_number: string;
        };
    };
};

type Props = {
    payment: Payment;
};

export default function Success({ payment }: Props) {
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            router.visit(route('payments.index'));
        }, 10000);

        return () => window.clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setSecondsLeft((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    const details = [
        ['Patient', payment.medical_record?.patient?.name ?? '-'],
        ['MR Number', payment.medical_record?.patient?.medical_record_number ?? '-'],
        ['Total Payment', `Rp ${Number(payment.total_payment).toLocaleString('id-ID')}`],
        ['Payment Method', payment.payment_method],
        ['Payment Date', payment.payment_date],
        ['Status', payment.status],
    ];

    return (
        <DashboardLayout>
            <Head title="Pembayaran Berhasil" />

            <div className="p-6">
                <div className="mx-auto max-w-3xl">
                    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="border-b border-zinc-200 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-6 dark:border-zinc-800 dark:from-blue-950 dark:via-zinc-950 dark:to-emerald-950">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800">
                                    <CheckCircle2 className="h-8 w-8" strokeWidth={1.9} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                                        Pembayaran Berhasil
                                    </h1>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        Transaksi berhasil diproses.
                                    </p>
                                </div>
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.5px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    {payment.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {details.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        <p className="text-xs font-bold uppercase tracking-[0.5px] text-zinc-500 dark:text-zinc-400">
                                            {label}
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={route('payments.show', payment.id)}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                                >
                                    <FileText className="h-4 w-4" strokeWidth={1.9} />
                                    Lihat Invoice
                                </Link>

                                <Link
                                    href={route('payments.index')}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <ListChecks className="h-4 w-4" strokeWidth={1.9} />
                                    Kembali ke Payments
                                </Link>
                            </div>

                            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
                                Halaman akan otomatis kembali ke Payments dalam{' '}
                                <span className="font-bold">{secondsLeft}</span> detik.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
