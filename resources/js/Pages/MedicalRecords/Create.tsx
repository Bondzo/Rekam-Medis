import PhysicalExaminationForm from '@/Components/PhysicalExaminationForm';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    buildPhysicalExamination,
    createEmptyPhysicalExamFields,
    PhysicalExamFields,
} from '@/lib/physical-examination';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

type Queue = {
    id: number;
    patient?: {
        id: number;
        name: string;
        medical_record_number: string;
    };
    doctor?: {
        id: number;
        name: string;
        specialist?: string | null;
    };
};

type Props = {
    queue?: Queue | null;
};

export default function Create({ queue }: Props) {
    const doctorSpecialist = queue?.doctor?.specialist ?? null;
    const [physicalExam, setPhysicalExam] = useState<PhysicalExamFields>({
        ...createEmptyPhysicalExamFields(doctorSpecialist),
    });
    const { data, setData, post, processing, errors, transform } = useForm({
        patient_id: queue?.patient?.id || '',
        doctor_id: queue?.doctor?.id || '',
        queue_id: queue?.id || '',

        complaint: '',
        physical_examination: '',
        diagnosis: '',
        medical_treatment: '',
        record_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            physical_examination: buildPhysicalExamination(
                physicalExam,
                doctorSpecialist
            ),
        }));

        post(route('medical-records.store'));
    };

    const updatePhysicalExam = (
        field: keyof PhysicalExamFields,
        value: string
    ) => {
        setPhysicalExam((current) => ({
            ...current,
            [field]: value,
        }));
    };

    return (
        <DashboardLayout>
            <Head title="Create Medical Record" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create Medical Record
                        </h1>

                        <p className="text-sm text-gray-500">
                            Doctor examination form
                        </p>
                    </div>

                    <Link
                        href={route('medical-records.index')}
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white"
                    >
                        Back
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-xl bg-white p-6 shadow"
                >
                    {/* Patient Info */}
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Patient
                            </label>

                            <input
                                type="text"
                                value={queue?.patient?.name || ''}
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                MR Number
                            </label>

                            <input
                                type="text"
                                value={queue?.patient?.medical_record_number || ''}
                                disabled
                                className="w-full rounded-lg border-gray-300 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Record Date <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="date"
                                value={data.record_date}
                                onChange={(e) =>
                                    setData('record_date', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.record_date && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.record_date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Complaint */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Complaint
                        </label>

                        <textarea
                            value={data.complaint}
                            placeholder="Keluhan utama pasien"
                            onChange={(e) =>
                                setData('complaint', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />

                        {errors.complaint && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.complaint}
                            </p>
                        )}
                    </div>

                    <PhysicalExaminationForm
                        value={physicalExam}
                        onChange={updatePhysicalExam}
                        specialist={doctorSpecialist}
                        error={errors.physical_examination}
                    />

                    {/* Diagnosis */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Diagnosis
                        </label>

                        <textarea
                            value={data.diagnosis}
                            placeholder="Diagnosis dokter"
                            onChange={(e) =>
                                setData('diagnosis', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                        {errors.diagnosis && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.diagnosis}
                            </p>
                        )}
                    </div>

                    {/* Treatment */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Medical Treatment
                        </label>

                        <textarea
                            value={data.medical_treatment}
                            placeholder="Tindakan atau terapi"
                            onChange={(e) =>
                                setData(
                                    'medical_treatment',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                        {errors.medical_treatment && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.medical_treatment}
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">
                            Notes
                        </label>

                        <textarea
                            value={data.notes}
                            placeholder="Catatan tambahan"
                            onChange={(e) =>
                                setData('notes', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('medical-records.index')}
                            className="rounded-lg bg-gray-700 px-5 py-2 text-white"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Save Medical Record
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
