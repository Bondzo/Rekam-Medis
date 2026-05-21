import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

type Record = {
    id: number;
    complaint: string;
    physical_examination: string;
    diagnosis: string;
    medical_treatment: string;
    record_date: string;
    notes?: string | null;
    patient?: {
        name: string;
        medical_record_number: string;
        gender: string;
        phone: string;
        address: string;
    };
    doctor?: {
        name: string;
        specialist: string;
    };
};

type Props = {
    record: Record;
};

export default function Show({ record }: Props) {
    return (
        <DashboardLayout>
            <Head title="Medical Record Detail" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Medical Record Detail
                        </h1>
                        <p className="text-sm text-gray-500">
                            Complete patient examination information
                        </p>
                    </div>

                    <Link
                        href={route('medical-records.index')}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                        Back
                    </Link>
                </div>

                <div className="grid gap-6">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold">
                            Patient Information
                        </h2>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>MR Number:</strong> {record.patient?.medical_record_number ?? '-'}</p>
                            <p><strong>Name:</strong> {record.patient?.name ?? '-'}</p>
                            <p><strong>Gender:</strong> {record.patient?.gender ?? '-'}</p>
                            <p><strong>Phone:</strong> {record.patient?.phone ?? '-'}</p>
                            <p className="col-span-2"><strong>Address:</strong> {record.patient?.address ?? '-'}</p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold">
                            Examination
                        </h2>

                        <div className="grid gap-4 text-sm">
                            <p><strong>Date:</strong> {record.record_date}</p>
                            <p><strong>Doctor:</strong> Dr. {record.doctor?.name ?? '-'}</p>
                            <p><strong>Specialist:</strong> {record.doctor?.specialist ?? '-'}</p>
                            <p><strong>Complaint:</strong> {record.complaint}</p>
                            <p><strong>Physical Examination:</strong> {record.physical_examination}</p>
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            <p><strong>Medical Treatment:</strong> {record.medical_treatment}</p>
                            <p><strong>Notes:</strong> {record.notes ?? '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}