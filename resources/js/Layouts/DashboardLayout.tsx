import { Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({
    children,
}: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen overflow-hidden bg-[var(--rm-canvas)] text-[var(--rm-ink)]">
            <Sidebar
                open={sidebarOpen}
                onToggle={() => setSidebarOpen((open) => !open)}
            />

            {!sidebarOpen && (
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center border border-[var(--rm-hairline-strong)] bg-[var(--rm-surface)] text-[var(--rm-ink)] transition hover:bg-[var(--rm-surface-soft)]"
                    aria-label="Buka sidebar"
                >
                    <Menu className="h-5 w-5" strokeWidth={1.8} />
                </button>
            )}

            <main
                className={`h-screen overflow-y-auto p-6 transition-[padding,margin] duration-300 md:p-8 ${
                    sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                } ${sidebarOpen ? "" : "pt-20"}`}
            >
                {children}
            </main>
        </div>
    );
}
