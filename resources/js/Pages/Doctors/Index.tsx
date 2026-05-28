import { Pagination, SearchInput } from "../../Components/IndexControls";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";

type Doctor = {
    id: number;
    name: string;
    specialist: string;
    phone?: string | null;
};

type Props = {
    doctors: {
        data: Doctor[];
        links: any[];
    };
    filters: {
        search: string;
    };
};

function handleDelete(id: number) {
    if (confirm("Delete this doctor?")) {
        router.delete(`/doctors/${id}`);
    }
}

export default function Index({ doctors, filters }: Props) {
    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Doctors</h1>

                <Link href="/doctors/create" className="rm-button inline-flex items-center px-5">
                    Add Doctor
                </Link>
            </div>

            <div className="mb-4">
                <SearchInput routeName="/doctors" placeholder="Search doctor..." value={filters.search} />
            </div>

            <div className="rm-table-shell">
                <table className="w-full">
                    <thead className="rm-table-head">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Specialist</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {doctors.data.map((doctor) => (
                            <tr key={doctor.id} className="border-t">
                                <td className="p-4">Dr. {doctor.name}</td>
                                <td className="p-4">{doctor.specialist}</td>
                                <td className="p-4">{doctor.phone ?? "-"}</td>
                                <td className="flex gap-2 p-4">
                                    <Link
                                        href={`/doctors/${doctor.id}/edit`}
                                        className="rm-button inline-flex min-h-10 items-center px-4 text-xs"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(doctor.id)}
                                        className="rm-button rm-button-danger min-h-10 px-4 text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination links={doctors.links} />
            </div>
        </DashboardLayout>
    );
}
