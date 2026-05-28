import { Pagination, SearchInput } from "../../Components/IndexControls";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, router, usePage } from "@inertiajs/react";

type Queue = {
    id: number;
    queue_number: string;
    status: "waiting" | "checking" | "done" | string;
    patient?: {
        name: string;
    } | null;
    doctor?: {
        name: string;
    } | null;
};

type Props = {
    queues: {
        data: Queue[];
        links: any[];
    };
    filters: {
        search: string;
        status?: string | null;
    };
};

const statusFilters = [
    { label: "All", value: undefined, className: "rm-button-outline" },
    { label: "Waiting", value: "waiting", className: "rm-button rm-button-warning" },
    { label: "Checking", value: "checking", className: "rm-button" },
    { label: "Done", value: "done", className: "rm-button rm-button-success" },
];

function updateStatus(id: number, status: string) {
    router.put(`/queues/${id}/status`, { status });
}

function handleDelete(id: number) {
    if (confirm("Delete queue?")) {
        router.delete(`/queues/${id}`);
    }
}

export default function Index({ queues, filters }: Props) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Queues</h1>

                {user.role !== "doctor" && (
                    <Link href="/queues/create" className="rm-button inline-flex items-center px-5">
                        Add Queue
                    </Link>
                )}
            </div>

            <div className="mb-4">
                <SearchInput
                    routeName="/queues"
                    placeholder="Search queue..."
                    value={filters.search}
                    extraParams={{ status: filters.status }}
                />
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
                {statusFilters.map((item) => {
                    const active = (filters.status ?? undefined) === item.value;

                    return (
                        <button
                            key={item.label}
                            onClick={() =>
                                router.get(
                                    "/queues",
                                    {
                                        status: item.value,
                                        search: filters.search,
                                    },
                                    {
                                        preserveState: true,
                                        replace: true,
                                    }
                                )
                            }
                            className={`${item.className} px-5 ${active ? "" : "opacity-80 hover:opacity-100"}`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className="rm-table-shell">
                <table className="w-full">
                    <thead className="rm-table-head">
                        <tr>
                            <th className="p-4 text-left">Queue</th>
                            <th className="p-4 text-left">Patient</th>
                            <th className="p-4 text-left">Doctor</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {queues.data.map((queue) => (
                            <tr key={queue.id} className="border-t">
                                <td className="p-4">{queue.queue_number}</td>
                                <td className="p-4">{queue.patient?.name ?? "-"}</td>
                                <td className="p-4">{queue.doctor?.name ? `Dr. ${queue.doctor.name}` : "-"}</td>
                                <td className="p-4">
                                    <span
                                        className={`rm-status-pill inline-flex px-3 py-2 ${
                                            queue.status === "done"
                                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                                : ""
                                        }`}
                                    >
                                        {queue.status}
                                    </span>
                                </td>

                                <td className="flex flex-wrap gap-2 p-4">
                                    {user.role === "doctor" && queue.status !== "done" && (
                                        <Link
                                            href={route("medical-records.create", {
                                                queue_id: queue.id,
                                            })}
                                            className="rm-button rm-button-success inline-flex min-h-10 items-center px-4 text-xs"
                                        >
                                            Examine
                                        </Link>
                                    )}

                                    {user.role !== "doctor" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(queue.id, "checking")}
                                                className="rm-button rm-button-warning min-h-10 px-4 text-xs"
                                            >
                                                Checking
                                            </button>

                                            <button
                                                onClick={() => updateStatus(queue.id, "done")}
                                                className="rm-button rm-button-success min-h-10 px-4 text-xs"
                                            >
                                                Done
                                            </button>

                                            <button
                                                onClick={() => handleDelete(queue.id)}
                                                className="rm-button rm-button-danger min-h-10 px-4 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination links={queues.links} />
            </div>
        </DashboardLayout>
    );
}
