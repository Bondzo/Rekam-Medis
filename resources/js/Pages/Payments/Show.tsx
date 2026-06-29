import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Clock3, Info, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                callbacks?: {
                    onSuccess?: () => void;
                    onPending?: () => void;
                    onError?: () => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}

type PrescriptionItem = {
    id: number;
    dosage: string;
    quantity: number;
    subtotal: number;
    medicine?: {
        name: string;
    };
};

type Payment = {
    id: number;
    admin_fee: number;
    doctor_fee: number;
    medicine_fee: number;
    total_payment: number;
    payment_method: string;
    payment_date: string;
    status: 'unpaid' | 'paid';
    snap_token?: string | null;
    midtrans_order_id?: string | null;
    medical_record?: {
        patient?: {
            name: string;
            medical_record_number: string;
        };
        doctor?: {
            name: string;
        };
        prescription?: {
            items: PrescriptionItem[];
        };
    };
};

type Props = {
    payment: Payment;
    midtransClientKey?: string | null;
};

type PaymentMessage = {
    type: 'success' | 'pending' | 'error' | 'info';
    title: string;
    message: string;
};

const messageStyles: Record<PaymentMessage['type'], string> = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100',
    pending: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100',
    error: 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    info: 'border-zinc-300 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100',
};

const messageIcons = {
    success: CheckCircle2,
    pending: Clock3,
    error: XCircle,
    info: Info,
};

export default function Show({ payment, midtransClientKey }: Props) {
    const [paymentMessage, setPaymentMessage] = useState<PaymentMessage | null>(null);
    const isPaid = payment.status === 'paid';
    const canPayWithMidtrans =
        ['transfer', 'qris'].includes(payment.payment_method) &&
        !isPaid &&
        Boolean(payment.snap_token);
    const canConfirmManually =
        !isPaid &&
        payment.payment_method === 'cash' &&
        !canPayWithMidtrans;

    useEffect(() => {
        if (!midtransClientKey || !payment.snap_token) {
            return;
        }

        const existingScript = document.getElementById('midtrans-snap');

        if (existingScript) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'midtrans-snap';
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', midtransClientKey);
        document.body.appendChild(script);
    }, [midtransClientKey, payment.snap_token]);

    const payWithMidtrans = () => {
        if (!payment.snap_token || !window.snap) {
            setPaymentMessage({
                type: 'info',
                title: 'Midtrans Belum Siap',
                message: 'Mohon tunggu sebentar lalu coba kembali.',
            });
            return;
        }

        window.snap.pay(payment.snap_token, {
            onSuccess: () => {
                setPaymentMessage({
                    type: 'pending',
                    title: 'Memproses Pembayaran',
                    message: 'Pembayaran berhasil diterima. Status sedang diperbarui.',
                });

                router.put(
                    route('payments.mark-paid', payment.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setPaymentMessage({
                                type: 'success',
                                title: 'Pembayaran Berhasil',
                                message: 'Status pembayaran sudah selesai.',
                            });

                            window.setTimeout(() => {
                                router.visit(route('payments.success', payment.id));
                            }, 1500);
                        },
                        onError: () => {
                            setPaymentMessage({
                                type: 'error',
                                title: 'Update Status Gagal',
                                message: 'Pembayaran berhasil, tetapi status belum bisa diperbarui. Coba muat ulang halaman.',
                            });
                        },
                    }
                );
            },
            onPending: () => {
                setPaymentMessage({
                    type: 'pending',
                    title: 'Pembayaran Pending',
                    message: 'Silakan selesaikan pembayaran Anda.',
                });
            },
            onError: () => {
                setPaymentMessage({
                    type: 'error',
                    title: 'Pembayaran Gagal',
                    message: 'Terjadi kesalahan saat memproses pembayaran.',
                });
            },
            onClose: () => {
                setPaymentMessage({
                    type: 'info',
                    title: 'Pembayaran Belum Selesai',
                    message: 'Popup pembayaran ditutup sebelum transaksi selesai.',
                });
            },
        });
    };

    const confirmPayment = () => {
        router.put(
            route('payments.confirm', payment.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPaymentMessage({
                        type: 'success',
                        title: 'Pembayaran Berhasil',
                        message: 'Pembayaran tunai berhasil dikonfirmasi.',
                    });

                    window.setTimeout(() => {
                        router.visit(route('payments.success', payment.id));
                    }, 1200);
                },
            }
        );
    };

    const prescriptionItems = payment.medical_record?.prescription?.items ?? [];

    return (
        <DashboardLayout>
            <Head title="Payment Detail" />

            {paymentMessage && (
                <PaymentNotification
                    message={paymentMessage}
                    onClose={() => setPaymentMessage(null)}
                />
            )}

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Payment Invoice
                        </h1>
                        <p className="text-sm text-gray-500">
                            Invoice and payment detail
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                        {isPaid && (
                            <>
                                <Link
                                    href={route('payments.print', payment.id)}
                                    className="rounded-xl bg-[var(--rm-action)] px-4 py-2 text-sm font-bold uppercase tracking-[0.5px] text-white"
                                >
                                    Print Struk
                                </Link>
                                <a
                                    href={route('payments.invoice-pdf', payment.id)}
                                    className="rounded-xl border border-[var(--rm-action)] px-4 py-2 text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-action)]"
                                >
                                    Download PDF
                                </a>
                            </>
                        )}

                        <Link
                            href={route('payments.index')}
                            className="rounded-xl bg-gray-700 px-4 py-2 text-sm text-white"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Patient</p>
                                <p className="font-semibold">
                                    {payment.medical_record?.patient?.name ?? '-'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {payment.medical_record?.patient?.medical_record_number ?? '-'}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                    payment.status === 'paid'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {payment.status}
                                </span>
                                <p className="mt-2 text-sm text-gray-500">
                                    {payment.midtrans_order_id ?? '-'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                            <p>
                                <strong>Doctor:</strong>{' '}
                                {payment.medical_record?.doctor?.name
                                    ? `Dr. ${payment.medical_record.doctor.name}`
                                    : '-'}
                            </p>
                            <p>
                                <strong>Payment Date:</strong> {payment.payment_date}
                            </p>
                            <p>
                                <strong>Payment Method:</strong> {payment.payment_method}
                            </p>
                        </div>

                        {isPaid && (
                            <div className="mb-6 rounded-lg bg-green-100 p-4 text-sm font-semibold text-green-700">
                                Pembayaran berhasil
                            </div>
                        )}

                        <div className="mb-6 overflow-hidden rounded-lg border">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Medicine</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Dosage</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Qty</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescriptionItems.map((item) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-4 py-3 text-sm">
                                                {item.medicine?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">{item.dosage}</td>
                                            <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                            <td className="px-4 py-3 text-sm">
                                                Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="ml-auto w-full max-w-sm space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Medicine Fee</span>
                                <span>Rp {Number(payment.medicine_fee).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Admin Fee</span>
                                <span>Rp {Number(payment.admin_fee).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Doctor Fee</span>
                                <span>Rp {Number(payment.doctor_fee).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                <span>Total</span>
                                <span>Rp {Number(payment.total_payment).toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {canPayWithMidtrans && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={payWithMidtrans}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                >
                                    Bayar Sekarang
                                </button>
                            </div>
                        )}

                        {canConfirmManually && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={confirmPayment}
                                    className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                                >
                                    Konfirmasi Pembayaran
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function PaymentNotification({
    message,
    onClose,
}: {
    message: PaymentMessage;
    onClose: () => void;
}) {
    const Icon = messageIcons[message.type];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/30 px-4 backdrop-blur-sm">
            <div
                className={`w-full max-w-md border p-5 shadow-2xl ${messageStyles[message.type]}`}
                role="status"
                aria-live="polite"
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 dark:bg-white/10">
                        <Icon className="h-6 w-6" strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold">{message.title}</h2>
                        <p className="mt-1 text-sm opacity-85">{message.message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/60 text-current transition hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20"
                        aria-label="Tutup notifikasi"
                    >
                        <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
    );
}
