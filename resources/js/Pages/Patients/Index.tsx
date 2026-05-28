import DashboardLayout from "../../Layouts/DashboardLayout";
import { Patient } from "../../types/patient";
import { Link, router } from "@inertiajs/react";
import { Pagination, SearchInput } from "../../Components/IndexControls";

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

                <Link href="/patients/create" className="rm-button inline-flex items-center px-5">
                    Add Patient
                </Link>

            </div>

            <div className="mb-4">

                <SearchInput routeName="/patients" placeholder="Search patient..." value={filters.search} />

            </div>

            <div className="rm-table-shell">

                <table className="w-full">

                    <thead className="rm-table-head">

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
                                        className="rm-button inline-flex min-h-10 items-center px-4 text-xs"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(patient.id)}
                                        className="rm-button rm-button-danger min-h-10 px-4 text-xs"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <Pagination links={patients.links} />

            </div>

        </DashboardLayout>
    );
}
