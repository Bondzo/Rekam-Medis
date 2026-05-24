import { Link } from "@inertiajs/react";
import DashboardLayout from "../Layouts/DashboardLayout";

type Role = "admin" | "doctor" | "staff";

type Patient = {
    id: number;
    name: string;
};

type Doctor = {
    id: number;
    name: string;
};

type Queue = {
    id: number;
    queue_number: string;
    queue_date: string;
    status: string;
    patient?: Patient | null;
    doctor?: Doctor | null;
};

type Payment = {
    id: number;
    total_payment: number | string;
    payment_date: string;
    status: string;
    medical_record?: {
        patient?: Patient | null;
    } | null;
};

type Props = {
    role: Role;
    doctorName?: string;
    totalPatients?: number;
    totalDoctors?: number;
    totalQueuesToday?: number;
    totalMedicalRecords?: number;
    totalMedicines?: number;
    totalPrescriptions?: number;
    totalPayments?: number;
    totalIncomePaid?: number | string;
    totalWaitingQueues?: number;
    totalCheckingQueues?: number;
    totalDoneQueues?: number;
    totalLowStockMedicines?: number;
    totalUnpaidPayments?: number;
    totalPaidPaymentsToday?: number;
    todayQueues?: Queue[];
    recentQueues?: Queue[];
    recentPayments?: Payment[];
};

const formatCurrency = (value: number | string | undefined) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

function StatCard({
    label,
    value,
}: {
    label: string;
    value: number | string | undefined;
}) {
    return (
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value ?? 0}</p>
        </div>
    );
}

function QuickAction({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
            {label}
        </Link>
    );
}

function RecentQueues({
    title = "Recent Queues",
    queues,
}: {
    title?: string;
    queues?: Queue[];
}) {
    return (
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <div className="mt-4 divide-y divide-gray-100">
                {queues && queues.length > 0 ? (
                    queues.map((queue) => (
                        <div key={queue.id} className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-semibold text-gray-900">{queue.queue_number}</p>
                                <p className="text-sm text-gray-500">
                                    {queue.patient?.name ?? "-"}
                                    {queue.doctor?.name ? ` - ${queue.doctor.name}` : ""}
                                </p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-700">
                                {queue.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="py-3 text-sm text-gray-500">No queue data.</p>
                )}
            </div>
        </div>
    );
}

function RecentPayments({ payments }: { payments?: Payment[] }) {
    return (
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>

            <div className="mt-4 divide-y divide-gray-100">
                {payments && payments.length > 0 ? (
                    payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {payment.medical_record?.patient?.name ?? "-"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatCurrency(payment.total_payment)}
                                </p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-700">
                                {payment.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="py-3 text-sm text-gray-500">No payment data.</p>
                )}
            </div>
        </div>
    );
}

function AdminDashboard({
    totalPatients,
    totalDoctors,
    totalQueuesToday,
    totalMedicalRecords,
    totalMedicines,
    totalPrescriptions,
    totalPayments,
    totalIncomePaid,
    recentQueues,
    recentPayments,
}: Props) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Patients" value={totalPatients} />
                <StatCard label="Total Doctors" value={totalDoctors} />
                <StatCard label="Queues Today" value={totalQueuesToday} />
                <StatCard label="Medical Records" value={totalMedicalRecords} />
                <StatCard label="Medicines" value={totalMedicines} />
                <StatCard label="Prescriptions" value={totalPrescriptions} />
                <StatCard label="Payments" value={totalPayments} />
                <StatCard label="Income Paid" value={formatCurrency(totalIncomePaid)} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <RecentQueues queues={recentQueues} />
                <RecentPayments payments={recentPayments} />
            </div>
        </>
    );
}

function DoctorDashboard({
    doctorName,
    todayQueues,
    totalWaitingQueues,
    totalCheckingQueues,
    totalDoneQueues,
    totalMedicalRecords,
    recentQueues,
}: Props) {
    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">Doctor: {doctorName ?? "-"}</p>
                <div className="flex flex-wrap gap-2">
                    <QuickAction href="/queues" label="Open Queues" />
                    <QuickAction href="/medical-records" label="Medical Records" />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Queues Today" value={todayQueues?.length ?? 0} />
                <StatCard label="Waiting" value={totalWaitingQueues} />
                <StatCard label="Checking" value={totalCheckingQueues} />
                <StatCard label="Done" value={totalDoneQueues} />
                <StatCard label="Medical Records Created" value={totalMedicalRecords} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <RecentQueues title="Queues Today" queues={todayQueues} />
                <RecentQueues queues={recentQueues} />
            </div>
        </>
    );
}

function StaffDashboard({
    totalPatients,
    totalQueuesToday,
    totalWaitingQueues,
    totalMedicines,
    totalLowStockMedicines,
    totalUnpaidPayments,
    totalPaidPaymentsToday,
    recentQueues,
    recentPayments,
}: Props) {
    return (
        <>
            <div className="mb-6 flex flex-wrap gap-2">
                <QuickAction href="/patients" label="Patients" />
                <QuickAction href="/queues" label="Queues" />
                <QuickAction href="/payments" label="Payments" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Patients" value={totalPatients} />
                <StatCard label="Queues Today" value={totalQueuesToday} />
                <StatCard label="Waiting Queue" value={totalWaitingQueues} />
                <StatCard label="Medicines" value={totalMedicines} />
                <StatCard label="Low Stock Medicines" value={totalLowStockMedicines} />
                <StatCard label="Unpaid Payments" value={totalUnpaidPayments} />
                <StatCard label="Paid Payments Today" value={totalPaidPaymentsToday} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <RecentQueues queues={recentQueues} />
                <RecentPayments payments={recentPayments} />
            </div>
        </>
    );
}

export default function Dashboard(props: Props) {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {props.role === "doctor" && <DoctorDashboard {...props} />}
            {props.role === "staff" && <StaffDashboard {...props} />}
            {props.role === "admin" && <AdminDashboard {...props} />}
        </DashboardLayout>
    );
}
