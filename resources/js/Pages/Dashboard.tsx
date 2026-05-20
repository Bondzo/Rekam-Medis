import DashboardLayout from "../Layouts/DashboardLayout";

type Props = {
    role: string;
    totalPatients?: number;
    totalQueues?: number;
    totalDoctors?: number;
    queues?: any[];
};

export default function Dashboard({
    role,
    totalPatients,
    totalQueues,
    totalDoctors,
    queues,
}: Props) {

    return (

        <DashboardLayout>

            <h1 className="text-4xl font-bold mb-8">
                Dashboard
            </h1>

            {role === "doctor" ? (

                <div className="bg-white rounded-lg shadow p-6">

                    <h2 className="text-2xl font-bold mb-4">
                        Queue Today
                    </h2>

                    <div className="space-y-3">

                        {queues?.map((queue) => (

                            <div
                                key={queue.id}
                                className="border rounded-lg p-4"
                            >

                                <div className="font-bold">
                                    {queue.queue_number}
                                </div>

                                <div>
                                    {queue.patient?.name}
                                </div>

                                <div>
                                    {queue.status}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            ) : (

                <div className="grid grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2>Total Patients</h2>

                        <p className="text-3xl font-bold mt-2">
                            {totalPatients}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2>Queue Today</h2>

                        <p className="text-3xl font-bold mt-2">
                            {totalQueues}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2>Total Doctors</h2>

                        <p className="text-3xl font-bold mt-2">
                            {totalDoctors}
                        </p>
                    </div>

                </div>

            )}

        </DashboardLayout>

    );
}