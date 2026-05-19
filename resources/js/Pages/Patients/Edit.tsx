import DashboardLayout from "../../Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";
import { Patient } from "../../types/patient";

type Props = {
    patient: Patient;
};

export default function Edit({ patient }: Props) {

    const { data, setData, put, processing, errors } =
        useForm({
            nik: patient.nik,
            name: patient.name,
            gender: patient.gender,
            birth_date: patient.birth_date,
            phone: patient.phone || "",
            address: patient.address || "",
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(`/patients/${patient.id}`);
    }

    return (
        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">
                Edit Patient
            </h1>

            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-lg shadow space-y-4"
            >

                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={data.nik}
                    onChange={(e) =>
                        setData("nik", e.target.value)
                    }
                />

                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={data.name}
                    onChange={(e) =>
                        setData("name", e.target.value)
                    }
                />

                <select
                    className="w-full border rounded p-2"
                    value={data.gender}
                    onChange={(e) =>
                        setData("gender", e.target.value as "L" | "P")
                    }
                >
                    <option value="L">Male</option>
                    <option value="P">Female</option>
                </select>

                <input
                    type="date"
                    className="w-full border rounded p-2"
                    value={data.birth_date}
                    onChange={(e) =>
                        setData("birth_date", e.target.value)
                    }
                />

                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={data.phone}
                    onChange={(e) =>
                        setData("phone", e.target.value)
                    }
                />

                <textarea
                    className="w-full border rounded p-2"
                    value={data.address}
                    onChange={(e) =>
                        setData("address", e.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                >
                    Update Patient
                </button>

            </form>

        </DashboardLayout>
    );
}