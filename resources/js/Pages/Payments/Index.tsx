import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

type Payment = {
    id: number;
    medicine_fee: number;
    total_payment: number;
    status: 'unpaid' | 'paid';
    payment_method: string;
    medical_record?: {
        id: number;
        patient?: {
            name: string;
            medical_record_number: string;
        };
        doctor?: {
            name: string;
        };
    };
};

type Props = {
    payments: Payment[];
};

export default function Index({ payments }: Props) {
    return (
        <DashboardLayout>
            <Head title="Payments" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Payments
                        </h1>
                        <p className="text-sm text-gray-500">
                            Patient billing and payment management
                        </p>
                    </div>

                    <Link
                        href={route('payments.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Create Payment
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">MR Number</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Patient</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Doctor</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Medicine Fee</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="border-t">
                                        <td className="px-4 py-3 text-sm">
                                            {payment.medical_record?.patient?.medical_record_number ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {payment.medical_record?.patient?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {payment.medical_record?.doctor?.name
                                                ? `Dr. ${payment.medical_record.doctor.name}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            Rp {Number(payment.medicine_fee).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            Rp {Number(payment.total_payment).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                                payment.status === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Link
                                                href={route('payments.show', payment.id)}
                                                className="rounded bg-gray-700 px-3 py-1 text-white"
                                            >
                                                Detail / Pay
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
