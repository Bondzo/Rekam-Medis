import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link } from "@inertiajs/react";

type Props = {
    doctors: any[];
};

export default function Index({ doctors }: Props) {
    return (
        <DashboardLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Doctors
                </h1>

                
                <Link
                    href="/doctors/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded border border-black"
                >
                    Add Doctor
                </Link>

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Specialist
                            </th>

                            <th className="p-4 text-left">
                                Phone
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {doctors.map((doctor) => (

                            <tr
                                key={doctor.id}
                                className="border-t"
                            >

                                <td className="p-4">
                                    Dr. {doctor.name}
                                </td>

                                <td className="p-4">
                                    {doctor.specialist}
                                </td>

                                <td className="p-4">
                                    {doctor.phone}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </DashboardLayout>
    );
}