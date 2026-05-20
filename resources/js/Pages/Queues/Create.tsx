import DashboardLayout from "../../Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";

type Props = {
    patients: any[];
    doctors: any[];
};

export default function Create({
    patients,
    doctors,
}: Props) {

    const { data, setData, post } = useForm({
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

            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-lg shadow space-y-4"
            >

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
                            value={patient.id}
                        >
                            {patient.name}
                        </option>

                    ))}

                </select>

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
                            value={doctor.id}
                        >
                            Dr. {doctor.name}
                            {" - "}
                            {doctor.specialist}
                        </option>

                    ))}

                </select>

                <button
                    type="submit"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Save Queue
                </button>

            </form>

        </DashboardLayout>
    );
}