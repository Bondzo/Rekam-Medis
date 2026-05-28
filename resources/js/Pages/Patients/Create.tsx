import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Create() {

    const { data, setData, post, processing, errors } =
        useForm({
            nik: "",
            name: "",
            gender: "",
            birth_date: "",
            phone: "",
            address: "",
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post("/patients");
    }

    return (
        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">
                Add Patient
            </h1>

            <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow">

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                    <label className="mb-1 block text-sm font-medium">NIK <span className="text-red-500">*</span></label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.nik}
                        placeholder="Masukkan NIK pasien"
                        onChange={(e) =>
                            setData("nik", e.target.value)
                        }
                    />

                    {errors.nik && (
                        <div className="text-red-500 text-sm">
                            {errors.nik}
                        </div>
                    )}
                    </div>

                    <div>
                    <label className="mb-1 block text-sm font-medium">Name <span className="text-red-500">*</span></label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.name}
                        placeholder="Nama lengkap pasien"
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
                    <label className="mb-1 block text-sm font-medium">Gender <span className="text-red-500">*</span></label>

                    <select
                        className="w-full border rounded p-2"
                        value={data.gender}
                        onChange={(e) =>
                            setData("gender", e.target.value)
                        }
                    >
                        <option value="">
                            Select Gender
                        </option>

                        <option value="L">
                            Male
                        </option>

                        <option value="P">
                            Female
                        </option>
                    </select>
                    {errors.gender && (
                        <div className="text-red-500 text-sm">
                            {errors.gender}
                        </div>
                    )}
                    </div>

                    <div>
                    <label className="mb-1 block text-sm font-medium">Birth Date <span className="text-red-500">*</span></label>

                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={data.birth_date}
                        onChange={(e) =>
                            setData("birth_date", e.target.value)
                        }
                    />
                    {errors.birth_date && (
                        <div className="text-red-500 text-sm">
                            {errors.birth_date}
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
                        placeholder="Alamat pasien"
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
                    <Link href="/patients" className="rounded bg-gray-700 px-4 py-2 text-white">
                        Back
                    </Link>
                    <button
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save Patient
                    </button>
                </div>

            </form>

        </DashboardLayout>
    );
}
