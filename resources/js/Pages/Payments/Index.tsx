import { Pagination, SearchInput } from '@/Components/IndexControls';
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
    payments: {
        data: Payment[];
        links: any[];
    };
    filters: {
        search: string;
    };
    todayOnly?: boolean;
};

export default function Index({ payments, filters, todayOnly = false }: Props) {
    return (
        <DashboardLayout>
            <Head title="Payments" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payments</h1>
                        <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">
                            Patient billing and payment management
                        </p>
                    </div>

                    <Link href={route('payments.create')} className="rm-button inline-flex items-center px-5">
                        Create Payment
                    </Link>
                </div>

                {todayOnly && (
                    <div className="mb-4 inline-flex border border-[var(--rm-hairline)] bg-[var(--rm-surface-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.5px] text-[var(--rm-muted)]">
                        Menampilkan data hari ini
                    </div>
                )}

                <div className="mb-4">
                    <SearchInput routeName="/payments" placeholder="Search payment..." value={filters.search} />
                </div>

                <div className="rm-table-shell">
                    <table className="w-full border-collapse">
                        <thead className="rm-table-head">
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
                            {payments.data.length > 0 ? (
                                payments.data.map((payment) => (
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
                                            <span
                                                className={`rm-status-pill inline-flex px-3 py-2 ${
                                                    payment.status === 'paid'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                                                }`}
                                            >
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Link
                                                href={route('payments.show', payment.id)}
                                                className="rm-button-outline inline-flex min-h-10 items-center px-4 text-xs"
                                            >
                                                Detail / Pay
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination links={payments.links} />
                </div>
            </div>
        </DashboardLayout>
    );
}
