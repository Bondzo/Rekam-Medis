import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

type PrescriptionItem = {
    id: number;
    dosage: string;
    quantity: number;
    subtotal: number;
    medicine?: {
        name: string;
    };
};

type Prescription = {
    id: number;
    notes?: string | null;
    medical_record?: {
        id: number;
        patient?: {
            name: string;
            medical_record_number: string;
        };
        doctor?: {
            name: string;
        };
    };
    items: PrescriptionItem[];
};

type Props = {
    prescriptions: Prescription[];
};

export default function Index({ prescriptions }: Props) {
    return (
        <DashboardLayout>
            <Head title="Prescriptions" />

            <div className="p-6">

                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Prescriptions
                        </h1>

                        <p className="text-sm text-gray-500">
                            Patient prescription management
                        </p>
                    </div>

                    <Link
                        href={route('prescriptions.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Create Prescription
                    </Link>

                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <table className="w-full border-collapse">

                        <thead className="bg-gray-100">
                            <tr>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    MR Number
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Patient
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Doctor
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Medicines
                                </th>

                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                    Total
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {prescriptions.length > 0 ? (

                                prescriptions.map((prescription) => {

                                    const total = prescription.items.reduce(
                                        (sum, item) => sum + Number(item.subtotal),
                                        0
                                    );

                                    return (
                                        <tr
                                            key={prescription.id}
                                            className="border-t"
                                        >

                                            <td className="px-4 py-3 text-sm">
                                                {
                                                    prescription.medical_record?.patient?.medical_record_number
                                                }
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                {
                                                    prescription.medical_record?.patient?.name
                                                }
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                Dr. {
                                                    prescription.medical_record?.doctor?.name
                                                }
                                            </td>

                                            <td className="px-4 py-3 text-sm">

                                                <div className="space-y-1">

                                                    {prescription.items.map((item) => (

                                                        <div key={item.id}>

                                                            - {item.medicine?.name}
                                                            {' '}
                                                            ({item.quantity})

                                                        </div>

                                                    ))}

                                                </div>

                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                Rp {total.toLocaleString('id-ID')}
                                            </td>

                                        </tr>
                                    );
                                })

                            ) : (

                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No prescriptions found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </DashboardLayout>
    );
}
