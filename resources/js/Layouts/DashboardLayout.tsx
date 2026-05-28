import { PropsWithChildren } from "react";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-[var(--rm-canvas)] text-[var(--rm-ink)]">

            <Sidebar />

            <main className="flex-1 p-6 md:p-8">
                {children}
            </main>

        </div>
    );
}
