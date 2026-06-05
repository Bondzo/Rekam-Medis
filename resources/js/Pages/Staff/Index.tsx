import { Pagination, SearchInput } from "../../Components/IndexControls";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, router } from "@inertiajs/react";

type Staff = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

type Props = {
    staff: {
        data: Staff[];
        links: any[];
    };
    filters: {
        search: string;
    };
};

function handleDelete(id: number) {
    if (confirm("Delete this staff account?")) {
        router.delete(`/staff/${id}`);
    }
}

export default function Index({ staff, filters }: Props) {
    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Staff</h1>

                <Link href="/staff/create" className="rm-button inline-flex items-center px-5">
                    Add Staff
                </Link>
            </div>

            <div className="mb-4">
                <SearchInput routeName="/staff" placeholder="Search staff..." value={filters.search} />
            </div>

            <div className="rm-table-shell">
                <table className="w-full">
                    <thead className="rm-table-head">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {staff.data.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">{item.email}</td>
                                <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                                <td className="flex gap-2 p-4">
                                    <Link
                                        href={`/staff/${item.id}/edit`}
                                        className="rm-button inline-flex min-h-10 items-center px-4 text-xs"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="rm-button rm-button-danger min-h-10 px-4 text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination links={staff.links} />
            </div>
        </DashboardLayout>
    );
}
