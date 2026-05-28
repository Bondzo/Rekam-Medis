import DashboardLayout from '@/Layouts/DashboardLayout';
import { Pagination, SearchInput } from '@/Components/IndexControls';
import { Head, Link, router } from '@inertiajs/react';

type Medicine = {
    id: number;
    name: string;
    stock: number;
    unit: string;
    price: number;
    description?: string | null;
};

type Props = {
    medicines: {
        data: Medicine[];
        links: any[];
    };
    filters: {
        search: string;
    };
};

export default function Index({ medicines, filters }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Delete this medicine?')) {
            router.delete(route('medicines.destroy', id));
        }
    };

    return (
        <DashboardLayout>
            <Head title="Medicines" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Medicines
                        </h1>

                        <p className="text-sm text-gray-500">
                            Medicine inventory management
                        </p>
                    </div>

                    <Link
                        href={route('medicines.create')}
                        className="rm-button inline-flex items-center px-5"
                    >
                        Add Medicine
                    </Link>
                </div>

                <div className="mb-4">
                    <SearchInput routeName="/medicines" placeholder="Search medicine..." value={filters.search} />
                </div>

                <div className="rm-table-shell">
                    <table className="w-full border-collapse">
                        <thead className="rm-table-head">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Name
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Stock
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Unit
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Price
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Description
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {medicines.data.length > 0 ? (
                                medicines.data.map((medicine) => (
                                    <tr
                                        key={medicine.id}
                                        className="border-t"
                                    >
                                        <td className="px-4 py-3 text-sm">
                                            {medicine.name}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            {medicine.stock}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            {medicine.unit}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            Rp{' '}
                                            {Number(
                                                medicine.price
                                            ).toLocaleString('id-ID')}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            {medicine.description ?? '-'}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route(
                                                        'medicines.edit',
                                                        medicine.id
                                                    )}
                                                    className="rm-button inline-flex min-h-10 items-center px-4 text-xs"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            medicine.id
                                                        )
                                                    }
                                                    className="rm-button rm-button-danger min-h-10 px-4 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No medicines found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination links={medicines.links} />
                </div>
            </div>
        </DashboardLayout>
    );
}
