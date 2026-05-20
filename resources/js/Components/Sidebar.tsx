import { Link, usePage } from "@inertiajs/react";

export default function Sidebar() {

    const { auth } = usePage().props as any;

    const user = auth.user;

    return (

        <div className="w-64 min-h-screen bg-white shadow-lg p-4">

            <h1 className="text-2xl font-bold mb-8">
                Rekam Medis
            </h1>

            <div className="space-y-2">

                <Link
                    href="/dashboard"
                    className="block p-2 rounded hover:bg-gray-100"
                >
                    Dashboard
                </Link>

                {user.role !== "doctor" && (

                    <Link
                        href="/patients"
                        className="block p-2 rounded hover:bg-gray-100"
                    >
                        Patients
                    </Link>

                )}

                <Link
                    href="/queues"
                    className="block p-2 rounded hover:bg-gray-100"
                >
                    Queues
                </Link>

                {user.role === "admin" && (

                    <Link
                        href="/doctors"
                        className="block p-2 rounded hover:bg-gray-100"
                    >
                        Doctors
                    </Link>

                )}

                {user.role !== "staff" && (

                    <Link
                        href="/medical-records"
                        className="block p-2 rounded hover:bg-gray-100"
                    >
                        Medical Records
                    </Link>

                )}

                {user.role !== "doctor" && (

                    <Link
                        href="/payments"
                        className="block p-2 rounded hover:bg-gray-100"
                    >
                        Payments
                    </Link>

                )}

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </Link>

            </div>

        </div>

    );
}