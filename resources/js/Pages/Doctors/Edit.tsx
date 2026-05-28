import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, useForm } from "@inertiajs/react";

const specialists = [
    "Umum",
    "Anak",
    "Mata",
    "Gigi",
    "THT",
    "Kulit",
    "Jantung",
    "Saraf",
];

export default function Edit({ doctor }: any) {

        const {
            data,
            setData,
            put,
            processing,
            errors
        } =
        useForm({
            name: doctor.name,
            specialist: doctor.specialist,
            phone: doctor.phone || "",
            address: doctor.address || "",
        })

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(`/doctors/${doctor.id}`);
    }

    return (
        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">
                Edit Doctor
            </h1>

            <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow">
                <div className="grid gap-4 md:grid-cols-2">

                <div>

                    <label className="mb-1 block text-sm font-medium">Name <span className="text-red-500">*</span></label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.name}
                        placeholder="Nama dokter"
                        onChange={(e) =>
                            setData("name", e.target.value)
                        }
                    />

                    {errors.name && (
                        <div className="text-red-500 text-sm">
                            {errors.name}
                        </div>
                    )}

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">Specialist <span className="text-red-500">*</span></label>

                    <select
                        className="w-full border rounded p-2"
                        value={data.specialist}
                        onChange={(e) =>
                            setData("specialist", e.target.value)
                        }
                    >

                        <option value="">
                            Select Specialist
                        </option>

                        {specialists.map((specialist) => (

                            <option
                                key={specialist}
                                value={specialist}
                            >
                                {specialist}
                            </option>

                        ))}

                    </select>
                    {errors.specialist && (
                        <div className="text-red-500 text-sm">
                            {errors.specialist}
                        </div>
                    )}

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">Phone</label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.phone}
                        placeholder="Contoh: 081234567890"
                        onChange={(e) =>
                            setData("phone", e.target.value)
                        }
                    />
                    {errors.phone && (
                        <div className="text-red-500 text-sm">
                            {errors.phone}
                        </div>
                    )}

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">Address</label>

                    <textarea
                        className="w-full border rounded p-2"
                        value={data.address}
                        placeholder="Alamat praktik atau domisili"
                        onChange={(e) =>
                            setData("address", e.target.value)
                        }
                    />
                    {errors.address && (
                        <div className="text-red-500 text-sm">
                            {errors.address}
                        </div>
                    )}

                </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Link href="/doctors" className="rounded bg-gray-700 px-4 py-2 text-white">
                        Back
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Update Doctor
                    </button>
                </div>

            </form>

        </DashboardLayout>
    );
}
