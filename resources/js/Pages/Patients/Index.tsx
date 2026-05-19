import DashboardLayout from "../../Layouts/DashboardLayout";
import { Patient } from "../../types/patient";
import { Link, router } from "@inertiajs/react";

type Props = {
    patients: {
        data: Patient[];

        links: any[];
    };

    filters: {
        search: string;
    };
};

function handleDelete(id: number) {

    if (confirm("Delete this patient?")) {

        router.delete(`/patients/${id}`);

    }
}

export default function Index({
    patients,
    filters,
}: Props) {
    return (
        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Patients
                </h1>

                <Link
                    href="/patients/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded border border-black"
                >
                    Add Patient
                </Link>

            </div>

            <div className="mb-4">

                <input
                    type="text"
                    placeholder="Search patient..."
                    defaultValue={filters.search}
                    onChange={(e) =>
                        router.get(
                            "/patients",
                            {
                                search: e.target.value,
                            },
                            {
                                preserveState: true,
                                replace: true,
                            }
                        )
                    }
                    className="w-full border rounded-lg p-2"
                />

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">
                                MR Number
                            </th>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Gender
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

                        {patients.data.map((patient) => (

                            <tr
                                key={patient.id}
                                className="border-t"
                            >

                                <td className="p-4">
                                    {patient.medical_record_number}
                                </td>

                                <td className="p-4">
                                    {patient.name}
                                </td>

                                <td className="p-4">
                                    {patient.gender}
                                </td>

                                <td className="p-4">
                                    {patient.phone}
                                </td>

                                <td className="p-4 flex gap-2">

                                    <Link
                                        href={`/patients/${patient.id}/edit`}
                                        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 rounded-lg border border-yellow-700"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(patient.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <div className="mt-4 flex gap-2">

                {patients.links?.map((link: any, index: number) => (

                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => {

                            if (link.url) {
                                router.visit(link.url);
                            }

                        }}
                        className="px-3 py-1 border rounded"
                        dangerouslySetInnerHTML={{
                            __html: link.label
                        }}
                    />

                ))}

            </div>

            </div>

        </DashboardLayout>
    );
}