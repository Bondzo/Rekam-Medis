import DashboardLayout from "../../Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";

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

            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-lg shadow space-y-4"
            >

                <div>
                    <label>NIK</label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.nik}
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
                    <label>Name</label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.name}
                        onChange={(e) =>
                            setData("name", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Gender</label>

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
                </div>

                <div>
                    <label>Birth Date</label>

                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={data.birth_date}
                        onChange={(e) =>
                            setData("birth_date", e.target.value)
                        }
                    />
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
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded border border-black" 
                >
                    Save Patient
                </button>

            </form>

        </DashboardLayout>
    );
}