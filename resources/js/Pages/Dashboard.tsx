import { Link } from "@inertiajs/react";
import { Pagination } from "../Components/IndexControls";
import { ArrowRight, BarChart3, ClipboardList, CreditCard, ListChecks } from "lucide-react";
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

type MedicalRecord = {
    id: number;
    diagnosis: string;
    record_date: string;
    patient?: Patient | null;
};

type Paginated<T> = {
    data: T[];
    links: any[];
};

type Props = {
    role: Role;
    doctorName?: string;
    patientsRegisteredToday?: number;
    totalPatients?: number;
    totalDoctors?: number;
    totalQueues?: number;
    totalQueuesToday?: number;
    totalMedicalRecords?: number;
    totalMedicalRecordsToday?: number;
    totalMedicines?: number;
    totalPrescriptions?: number;
    totalPrescriptionsToday?: number;
    totalPayments?: number;
    totalIncomePaid?: number | string;
    incomeToday?: number | string;
    totalWaitingQueuesToday?: number;
    totalCheckingQueuesToday?: number;
    totalDoneQueuesToday?: number;
    totalLowStockMedicines?: number;
    totalUnpaidPaymentsToday?: number;
    totalPaidPaymentsToday?: number;
    todayQueues?: Queue[];
    recentQueues?: Queue[] | Paginated<Queue>;
    recentMedicalRecords?: MedicalRecord[];
    recentPayments?: Payment[] | Paginated<Payment>;
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
    admin = false,
}: {
    label: string;
    value: number | string | undefined;
    admin?: boolean;
}) {
    const displayValue = value ?? 0;
    const isCurrencyValue = String(displayValue).startsWith("Rp");
    const valueLength = String(displayValue).length;
    const valueSizeClass =
        isCurrencyValue
            ? "text-[clamp(1.45rem,1.8vw,1.875rem)]"
            : valueLength > 12
            ? "text-2xl xl:text-[1.7rem]"
            : valueLength > 8
              ? "text-3xl xl:text-[2rem]"
              : "text-4xl";

    return (
        <div className={`relative flex min-h-[180px] w-full bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:w-[calc(50%-8px)] dark:bg-[#1a1a1a] dark:ring-[#3c3c3c] ${admin ? "lg:w-[calc(33.333%-11px)]" : "lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]"}`}>
            <div className="rm-brand-strip absolute inset-x-0 top-0 h-1" />
            <div className="flex w-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                    <p className="max-w-[11rem] text-base font-medium leading-6 text-gray-600 dark:text-[#d7d7d7]">{label}</p>
                    <BarChart3 className="h-6 w-6 shrink-0 text-[var(--rm-ink)]" strokeWidth={2} />
                </div>
                <p className={`mt-8 max-w-full whitespace-nowrap font-bold leading-none tracking-normal text-gray-900 dark:text-white ${valueSizeClass}`}>
                    {displayValue}
                </p>
            </div>
        </div>
    );
}

function QuickAction({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-12 items-center gap-2 bg-[var(--rm-action)] px-4 py-2 text-sm font-bold uppercase tracking-[0.5px] text-white shadow-none hover:bg-[var(--rm-action-active)]"
        >
            {label}
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </Link>
    );
}

function RecentQueues({
    title = "Recent Queues",
    queues,
}: {
    title?: string;
    queues?: Queue[] | Paginated<Queue>;
}) {
    const queueData = Array.isArray(queues) ? queues : queues?.data;
    const links = Array.isArray(queues) ? undefined : queues?.links;

    return (
        <div className="bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-[#1a1a1a] dark:ring-[#3c3c3c]">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <ListChecks className="h-5 w-5 text-[var(--rm-action)]" strokeWidth={1.8} />
                {title}
            </h2>

            <div className="mt-4 divide-y divide-gray-100">
                {queueData && queueData.length > 0 ? (
                    queueData.map((queue) => (
                        <div key={queue.id} className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{queue.queue_number}</p>
                                <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">
                                    {queue.patient?.name ?? "-"}
                                    {queue.doctor?.name ? ` - ${queue.doctor.name}` : ""}
                                </p>
                            </div>
                            <span className={`rm-status-pill px-3 py-2 ${
                                queue.status === "done"
                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    : ""
                            }`}>
                                {queue.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="py-3 text-sm text-gray-500 dark:text-[#7e7e7e]">No queue data.</p>
                )}
            </div>

            <Pagination links={links} />
        </div>
    );
}

function RecentPayments({
    title = "Recent Payments",
    payments,
}: {
    title?: string;
    payments?: Payment[] | Paginated<Payment>;
}) {
    const paymentData = Array.isArray(payments) ? payments : payments?.data;
    const links = Array.isArray(payments) ? undefined : payments?.links;

    return (
        <div className="bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-[#1a1a1a] dark:ring-[#3c3c3c]">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <CreditCard className="h-5 w-5 text-[var(--rm-action)]" strokeWidth={1.8} />
                {title}
            </h2>

            <div className="mt-4 divide-y divide-gray-100">
                {paymentData && paymentData.length > 0 ? (
                    paymentData.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {payment.medical_record?.patient?.name ?? "-"}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">
                                    {formatCurrency(payment.total_payment)}
                                </p>
                            </div>
                            <span className={`rm-status-pill px-3 py-2 ${
                                payment.status === "paid"
                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                            }`}>
                                {payment.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="py-3 text-sm text-gray-500 dark:text-[#7e7e7e]">No payment data.</p>
                )}
            </div>

            <Pagination links={links} />
        </div>
    );
}

function RecentMedicalRecords({ records }: { records?: MedicalRecord[] }) {
    return (
        <div className="bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-[#1a1a1a] dark:ring-[#3c3c3c]">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <ClipboardList className="h-5 w-5 text-[var(--rm-action)]" strokeWidth={1.8} />
                Recent Medical Records Today
            </h2>

            <div className="mt-4 divide-y divide-gray-100">
                {records && records.length > 0 ? (
                    records.map((record) => (
                        <div key={record.id} className="py-3">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {record.patient?.name ?? "-"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">
                                {record.diagnosis || "No diagnosis"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="py-3 text-sm text-gray-500 dark:text-[#7e7e7e]">
                        No medical record data today.
                    </p>
                )}
            </div>
        </div>
    );
}

function AdminDashboard({
    totalPatients,
    totalDoctors,
    totalMedicalRecords,
    totalMedicines,
    totalPayments,
    totalIncomePaid,
    recentQueues,
    recentPayments,
}: Props) {
    return (
        <>
            <div className="flex flex-wrap justify-center gap-4">
                <StatCard admin label="Total Patients" value={totalPatients} />
                <StatCard admin label="Total Doctors" value={totalDoctors} />
                <StatCard admin label="Total Medical Records" value={totalMedicalRecords} />
                <StatCard admin label="Total Medicines" value={totalMedicines} />
                <StatCard admin label="Total Payments" value={totalPayments} />
                <StatCard admin label="Total Paid Income" value={formatCurrency(totalIncomePaid)} />
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
    totalWaitingQueuesToday,
    totalCheckingQueuesToday,
    totalDoneQueuesToday,
    totalMedicalRecordsToday,
    totalPrescriptionsToday,
    recentMedicalRecords,
}: Props) {
    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-[#bbbbbb]">Doctor: {doctorName ?? "-"}</p>
                <div className="flex flex-wrap gap-2">
                    <QuickAction href="/queues" label="Queues" />
                    <QuickAction href="/medical-records" label="Medical Records" />
                    <QuickAction href="/prescriptions" label="Prescriptions" />
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <StatCard label="Queues Today" value={todayQueues?.length ?? 0} />
                <StatCard label="Waiting Today" value={totalWaitingQueuesToday} />
                <StatCard label="Checking Today" value={totalCheckingQueuesToday} />
                <StatCard label="Done Today" value={totalDoneQueuesToday} />
                <StatCard label="Medical Records Today" value={totalMedicalRecordsToday} />
                <StatCard label="Prescriptions Today" value={totalPrescriptionsToday} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <RecentQueues title="Queues Today" queues={todayQueues} />
                <RecentMedicalRecords records={recentMedicalRecords} />
            </div>
        </>
    );
}

function StaffDashboard({
    patientsRegisteredToday,
    totalQueuesToday,
    totalWaitingQueuesToday,
    totalCheckingQueuesToday,
    totalDoneQueuesToday,
    totalLowStockMedicines,
    totalUnpaidPaymentsToday,
    totalPaidPaymentsToday,
    incomeToday,
    recentQueues,
    recentPayments,
}: Props) {
    return (
        <>
            <div className="mb-6 flex flex-wrap gap-2">
                <QuickAction href="/patients" label="Patients" />
                <QuickAction href="/queues" label="Queues" />
                <QuickAction href="/medicines" label="Medicines" />
                <QuickAction href="/payments" label="Payments" />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <StatCard label="Patients Registered Today" value={patientsRegisteredToday} />
                <StatCard label="Queues Today" value={totalQueuesToday} />
                <StatCard label="Waiting Queues Today" value={totalWaitingQueuesToday} />
                <StatCard label="Checking Queues Today" value={totalCheckingQueuesToday} />
                <StatCard label="Done Queues Today" value={totalDoneQueuesToday} />
                <StatCard label="Unpaid Payments Today" value={totalUnpaidPaymentsToday} />
                <StatCard label="Paid Payments Today" value={totalPaidPaymentsToday} />
                <StatCard label="Income Today" value={formatCurrency(incomeToday)} />
                <StatCard label="Low Stock Medicines" value={totalLowStockMedicines} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <RecentQueues title="Recent Queues Today" queues={recentQueues} />
                <RecentPayments title="Recent Payments Today" payments={recentPayments} />
            </div>
        </>
    );
}

export default function Dashboard(props: Props) {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--rm-action)]">
                    Rekam Medis
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="rm-brand-strip mt-4 h-1 w-32" />
            </div>

            {props.role === "doctor" && <DoctorDashboard {...props} />}
            {props.role === "staff" && <StaffDashboard {...props} />}
            {props.role === "admin" && <AdminDashboard {...props} />}
        </DashboardLayout>
    );
}
