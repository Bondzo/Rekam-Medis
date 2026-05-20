import DashboardLayout from "../../Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";

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
            post,
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
                Add Doctor
            </h1>

            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-lg shadow space-y-4"
            >

                <div>

                    <label>Name</label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.name}
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

                    <label>Specialist</label>

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

                </div>

                <div>

                    <label>Phone</label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.phone}
                        onChange={(e) =>
                            setData("phone", e.target.value)
                        }
                    />

                </div>

                <div>

                    <label>Address</label>

                    <textarea
                        className="w-full border rounded p-2"
                        value={data.address}
                        onChange={(e) =>
                            setData("address", e.target.value)
                        }
                    />

                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Save Doctor
                </button>

            </form>

        </DashboardLayout>
    );
}