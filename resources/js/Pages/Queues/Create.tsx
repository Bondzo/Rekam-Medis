import DashboardLayout from "../../Layouts/DashboardLayout";
import { useForm, Link } from "@inertiajs/react";

type Props = {
    patients: Array<{
        id: number;
        name: string;
        medical_record_number?: string | null;
    }>;
    doctors: Array<{
        id: number;
        name: string;
        specialist: string;
    }>;
};

export default function Create({
    patients,
    doctors,
}: Props) {

    const { data, setData, post, processing, errors } = useForm({
        patient_id: "",
        doctor_id: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post("/queues");
    }

    return (
        <DashboardLayout>

            <h1 className="text-3xl font-bold mb-6">
                Add Queue
            </h1>

            <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow">
                <div className="grid gap-4 md:grid-cols-2">
                <div>
                <label className="mb-1 block text-sm font-medium">Patient <span className="text-red-500">*</span></label>

                <select
                    className="w-full border rounded p-2"
                    value={data.patient_id}
                    onChange={(e) =>
                        setData(
                            "patient_id",
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Select Patient
                    </option>

                    {patients.map((patient) => (

                        <option
                            key={patient.id}
                            value={String(patient.id)}
                        >
                            {patient.name}
                        </option>

                    ))}

                </select>
                {errors.patient_id && (
                    <div className="text-red-500 text-sm">
                        {errors.patient_id}
                    </div>
                )}
                </div>

                <div>
                <label className="mb-1 block text-sm font-medium">Doctor <span className="text-red-500">*</span></label>
                <select
                    className="w-full border rounded p-2"
                    value={data.doctor_id}
                    onChange={(e) =>
                        setData(
                            "doctor_id",
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Select Doctor
                    </option>

                    {doctors.map((doctor) => (

                        <option
                            key={doctor.id}
                            value={String(doctor.id)}
                        >
                            Dr. {doctor.name}
                            {" - "}
                            {doctor.specialist}
                        </option>

                    ))}

                </select>
                {errors.doctor_id && (
                    <div className="text-red-500 text-sm">
                        {errors.doctor_id}
                    </div>
                )}
                </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Link href="/queues" className="rounded bg-gray-700 px-4 py-2 text-white">
                        Back
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Save Queue
                    </button>
                </div>

            </form>

        </DashboardLayout>
    );
}
