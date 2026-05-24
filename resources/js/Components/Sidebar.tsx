import { Link, usePage } from "@inertiajs/react";

type Role = "admin" | "doctor" | "staff";

type MenuItem = {
    label: string;
    href: string;
};

const menusByRole: Record<Role, MenuItem[]> = {
    admin: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Patients", href: "/patients" },
        { label: "Queues", href: "/queues" },
        { label: "Doctors", href: "/doctors" },
        { label: "Medical Records", href: "/medical-records" },
        { label: "Prescriptions", href: "/prescriptions" },
        { label: "Medicines", href: "/medicines" },
        { label: "Payments", href: "/payments" },
    ],
    doctor: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Queues", href: "/queues" },
        { label: "Medical Records", href: "/medical-records" },
        { label: "Prescriptions", href: "/prescriptions" },
    ],
    staff: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Patients", href: "/patients" },
        { label: "Queues", href: "/queues" },
        { label: "Medicines", href: "/medicines" },
        { label: "Payments", href: "/payments" },
    ],
};

export default function Sidebar() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                role: Role;
            };
        };
    };

    const menuItems = menusByRole[auth.user.role] ?? menusByRole.staff;

    return (
        <aside className="w-64 min-h-screen bg-white p-4 shadow-lg">
            <h1 className="mb-8 text-2xl font-bold text-gray-900">
                Rekam Medis
            </h1>

            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                        {item.label}
                    </Link>
                ))}

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="mt-6 w-full rounded-md bg-red-600 px-4 py-2 text-left text-sm font-semibold text-white hover:bg-red-700"
                >
                    Logout
                </Link>
            </nav>
        </aside>
    );
}
