import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';

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
    };
};

type Props = {
    queue?: Queue | null;
};

export default function Create({ queue }: Props) {
    const { data, setData, post, processing, errors } = useForm({
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

        post(route('medical-records.store'));
    };

    return (
        <DashboardLayout>
            <Head title="Create Medical Record" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Medical Record
                    </h1>

                    <p className="text-sm text-gray-500">
                        Doctor examination form
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-xl bg-white p-6 shadow"
                >
                    {/* Patient Info */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Complaint */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Complaint
                        </label>

                        <textarea
                            value={data.complaint}
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

                    {/* Physical Examination */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Physical Examination
                        </label>

                        <textarea
                            value={data.physical_examination}
                            onChange={(e) =>
                                setData(
                                    'physical_examination',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                    </div>

                    {/* Diagnosis */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Diagnosis
                        </label>

                        <textarea
                            value={data.diagnosis}
                            onChange={(e) =>
                                setData('diagnosis', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                    </div>

                    {/* Treatment */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium">
                            Medical Treatment
                        </label>

                        <textarea
                            value={data.medical_treatment}
                            onChange={(e) =>
                                setData(
                                    'medical_treatment',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">
                            Notes
                        </label>

                        <textarea
                            value={data.notes}
                            onChange={(e) =>
                                setData('notes', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Save Medical Record
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}