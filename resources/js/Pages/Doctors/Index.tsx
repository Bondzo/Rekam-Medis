import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";

type Props = {
    doctors: any[];
};

function handleDelete(id: number) {

    if (confirm("Delete this doctor?")) {

        router.delete(`/doctors/${id}`);

    }
}

export default function Index({ doctors }: Props) {
    return (
        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Doctors
                </h1>

                
                <Link
                    href="/doctors/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded border border-black"
                >
                    Add Doctor
                </Link>

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Specialist
                            </th>

                            <th className="p-4 text-left">
                                Phone
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>


                        </tr>




                    </thead>

                    <tbody>

                        {doctors.map((doctor) => (

                            <tr
                                key={doctor.id}
                                className="border-t"
                            >

                                <td className="p-4">
                                    Dr. {doctor.name}
                                </td>

                                <td className="p-4">
                                    {doctor.specialist}
                                </td>

                                <td className="p-4">
                                    {doctor.phone}
                                </td>

                                                            <td className="p-4 flex gap-2">

                                <Link
                                    href={`/doctors/${doctor.id}/edit`}
                                    className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-lg"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(doctor.id)}
                                    className="inline-block bg-red-600 text-white px-3 py-1 rounded-lg"
                                >
                                    Delete
                                </button>

                            </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </DashboardLayout>
    );
}