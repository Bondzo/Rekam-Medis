import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const medicineUnits = ['tablet', 'strip', 'botol', 'kapsul', 'tube', 'sachet'];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        stock: '',
        unit: '',
        price: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('medicines.store'));
    };

    return (
        <DashboardLayout>
            <Head title="Add Medicine" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Add Medicine
                        </h1>
                        <p className="text-sm text-gray-500">
                            Add new medicine inventory
                        </p>
                    </div>

                    <Link
                        href={route('medicines.index')}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            placeholder="Nama obat"
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border-gray-300"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Stock</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={data.stock}
                                placeholder="Contoh: 100"
                                onChange={(e) => setData('stock', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Unit</label>
                            <select
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="">Select unit</option>
                                {medicineUnits.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.unit && <p className="mt-1 text-sm text-red-500">{errors.unit}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Price</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.price}
                                placeholder="Contoh: 15000"
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            <p className="mt-1 text-xs text-gray-500">Masukkan angka tanpa format Rupiah.</p>
                            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <textarea
                            value={data.description}
                            placeholder="Deskripsi atau catatan obat"
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-lg border-gray-300"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('medicines.index')}
                            className="rounded-lg bg-gray-700 px-5 py-2 text-white"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Save Medicine
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
