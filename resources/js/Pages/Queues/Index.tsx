import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

type Props = {
    queues: any[];
};

function updateStatus(
    id: number,
    status: string
) {
    router.put(
        `/queues/${id}/status`,
        {
            status,
        }
    );
}

function handleDelete(id: number) {

    if (
        confirm("Delete queue?")
    ) {
        router.delete(
            `/queues/${id}`
        );
    }
}

export default function Index({ queues }: Props) {

    const { auth } = usePage().props as any;

    const user = auth.user;

    return (
        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Queues
                </h1>

                {user.role !== "doctor" && (

                <Link
                    href="/queues/create"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Queue
                </Link>
                )}

            </div>

            <div className="mb-4 flex gap-2">

            <button
                onClick={() =>
                    router.get("/queues")
                }
                className="bg-gray-300 px-3 py-1 rounded"
            >
                All
            </button>

            <button
                onClick={() =>
                    router.get(
                        "/queues?status=waiting"
                    )
                }
                className="bg-yellow-500 px-3 py-1 rounded"
            >
                Waiting
            </button>

            <button
                onClick={() =>
                    router.get(
                        "/queues?status=checking"
                    )
                }
                className="bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
                Checking
            </button>

            <button
                onClick={() =>
                    router.get(
                        "/queues?status=done"
                    )
                }
                className="bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
                Done
            </button>

        </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">
                                Queue
                            </th>

                            <th className="p-4 text-left">
                                Patient
                            </th>

                            <th className="p-4 text-left">
                                Doctor
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            {user.role !== "doctor" && (

                            <th className="p-4 text-left">
                                Actions
                            </th>
                            )}

                        </tr>
                                

                    </thead>

                    <tbody>

                        {queues.map((queue) => (

                            <tr
                                key={queue.id}
                                className="border-t"
                            >

                                <td className="p-4">
                                    {queue.queue_number}
                                </td>

                                <td className="p-4">
                                    {queue.patient?.name}
                                </td>

                                <td className="p-4">
                                    Dr. {queue.doctor?.name}
                                </td>

                                <td className="p-4">
                                    {queue.status}
                                </td>

                                {user.role !== "doctor" && (

                                <td className="p-4 flex gap-2">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                queue.id,
                                                "checking"
                                            )
                                        }
                                        className="bg-yellow-500 text-black px-3 py-1 rounded-lg"
                                    >
                                        Checking
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                queue.id,
                                                "done"
                                            )
                                        }
                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Done
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(queue.id)
                                        }
                                        className="bg-red-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </td>

                                    )}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </DashboardLayout>
    );
}