import { PropsWithChildren } from "react";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <main className="flex-1 p-6">
                {children}
            </main>

        </div>
    );
}