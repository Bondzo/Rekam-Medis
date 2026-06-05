import { Link, usePage } from "@inertiajs/react";
import {
    CalendarClock,
    ClipboardList,
    CreditCard,
    Gauge,
    LogOut,
    Menu,
    Moon,
    Pill,
    Stethoscope,
    Sun,
    UserRound,
    UserCog,
    UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";

type Role = "admin" | "doctor" | "staff";

type MenuItem = {
    label: string;
    href: string;
    icon: typeof Gauge;
};

const menusByRole: Record<Role, MenuItem[]> = {
    admin: [
        { label: "Dashboard", href: "/dashboard", icon: Gauge },
        { label: "Patients", href: "/patients", icon: UsersRound },
        { label: "Queues", href: "/queues", icon: CalendarClock },
        { label: "Doctors", href: "/doctors", icon: Stethoscope },
        { label: "Staff", href: "/staff", icon: UserCog },
        { label: "Medical Records", href: "/medical-records", icon: ClipboardList },
        { label: "Prescriptions", href: "/prescriptions", icon: Pill },
        { label: "Medicines", href: "/medicines", icon: Pill },
        { label: "Payments", href: "/payments", icon: CreditCard },
    ],
    doctor: [
        { label: "Dashboard", href: "/dashboard", icon: Gauge },
        { label: "Queues", href: "/queues", icon: CalendarClock },
        { label: "Medical Records", href: "/medical-records", icon: ClipboardList },
        { label: "Prescriptions", href: "/prescriptions", icon: Pill },
    ],
    staff: [
        { label: "Dashboard", href: "/dashboard", icon: Gauge },
        { label: "Patients", href: "/patients", icon: UsersRound },
        { label: "Queues", href: "/queues", icon: CalendarClock },
        { label: "Medical Records", href: "/medical-records", icon: ClipboardList },
        { label: "Prescriptions", href: "/prescriptions", icon: Pill },
        { label: "Medicines", href: "/medicines", icon: Pill },
        { label: "Payments", href: "/payments", icon: CreditCard },
    ],
};

export default function Sidebar({
    open,
    onToggle,
}: {
    open: boolean;
    onToggle: () => void;
}) {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const { auth } = usePage().props as {
        auth: {
            user: {
                role: Role;
            };
        };
    };

    const menuItems = menusByRole[auth.user.role] ?? menusByRole.staff;
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const initialTheme = savedTheme === "dark" ? "dark" : "light";

        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";

        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
    };

    const ThemeIcon = theme === "dark" ? Sun : Moon;

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--rm-hairline)] bg-[var(--rm-surface)] p-4 shadow-none transition-transform duration-300 ${
                open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rm-hairline-strong)] bg-[var(--rm-action)] text-white">
                        <UserRound className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl font-bold text-[var(--rm-ink)]">
                            Rekam Medis
                        </h1>
                        <p className="text-xs uppercase tracking-[1.5px] text-[var(--rm-muted)]">
                            Klinik
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onToggle}
                        className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--rm-hairline-strong)] bg-[var(--rm-surface)] text-[var(--rm-ink)] transition hover:bg-[var(--rm-surface-soft)]"
                        aria-label="Tutup sidebar"
                    >
                        <Menu className="h-5 w-5" strokeWidth={1.8} />
                    </button>
                </div>
            </div>

            <nav className="flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <MenuLink
                        key={item.href}
                        item={item}
                        active={currentPath === item.href || currentPath.startsWith(`${item.href}/`)}
                    />
                ))}

                <div className="flex-1" />

                <div className="space-y-3 pt-6">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex min-h-12 w-full items-center justify-between border border-[var(--rm-hairline-strong)] bg-[var(--rm-surface)] px-3 py-2 text-left text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-ink)] transition hover:bg-[var(--rm-surface-soft)]"
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        <span className="flex items-center gap-3">
                            <ThemeIcon className="h-4 w-4" strokeWidth={1.8} />
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 bg-[var(--rm-action)]" />
                            <span className="h-2 w-2 bg-[var(--rm-accent-red)]" />
                        </span>
                    </button>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex min-h-12 w-full items-center gap-3 bg-[var(--rm-action)] px-4 py-2 text-left text-sm font-bold uppercase tracking-[0.5px] text-white hover:bg-[var(--rm-action-active)]"
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.8} />
                        Logout
                    </Link>
                </div>
            </nav>
        </aside>
    );
}

function MenuLink({ item, active }: { item: MenuItem; active: boolean }) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`flex min-h-11 items-center gap-3 border-l-2 px-3 py-2 text-sm font-medium transition ${
                active
                    ? "border-[var(--rm-action)] bg-[var(--rm-surface-soft)] text-[var(--rm-ink)]"
                    : "border-transparent text-[var(--rm-body)] hover:bg-[var(--rm-surface-soft)] hover:text-[var(--rm-ink)]"
            }`}
        >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                active ? "bg-[var(--rm-action)] text-white" : "bg-[var(--rm-surface-elevated)] text-[var(--rm-action)]"
            }`}>
                <Icon className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span>{item.label}</span>
        </Link>
    );
}
