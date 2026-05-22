import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

type Payment = {
    id: number;
    total_payment: number;
    payment_method: string;
    payment_date: string;
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
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            router.visit(route('payments.index'));
        }, 10000);

        return () => window.clearTimeout(timeout);
    }, []);

    return (
        <DashboardLayout>
            <Head title="Pembayaran Berhasil" />

            <div className="p-6">
                <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
                    <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
                        <h1 className="text-2xl font-bold">
                            Pembayaran Berhasil
                        </h1>
                        <p className="mt-1 text-sm">
                            Status pembayaran sudah tercatat sebagai paid.
                        </p>
                    </div>

                    <div className="mb-6 grid gap-4 text-sm">
                        <p>
                            <strong>Patient:</strong>{' '}
                            {payment.medical_record?.patient?.name ?? '-'}
                        </p>
                        <p>
                            <strong>MR Number:</strong>{' '}
                            {payment.medical_record?.patient?.medical_record_number ?? '-'}
                        </p>
                        <p>
                            <strong>Total Payment:</strong> Rp{' '}
                            {Number(payment.total_payment).toLocaleString('id-ID')}
                        </p>
                        <p>
                            <strong>Payment Method:</strong> {payment.payment_method}
                        </p>
                        <p>
                            <strong>Payment Date:</strong> {payment.payment_date}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('payments.index')}
                            className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800"
                        >
                            Kembali ke Payments
                        </Link>

                        <Link
                            href={route('payments.show', payment.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Lihat Invoice
                        </Link>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                        Halaman akan otomatis kembali ke Payments dalam 10 detik.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
