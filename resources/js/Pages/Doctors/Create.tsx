import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, useForm } from "@inertiajs/react";

const specialists = [
    "Umum",
    "Anak",
    "Mata",
    "Gigi",
    "THT",
    "Kulit",
    "Jantung",
    "Saraf",
    "Tulang",
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        specialist: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post("/doctors");
    }

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Add Doctor</h1>

                <Link href="/doctors" className="rm-button-outline inline-flex min-h-11 items-center px-5">
                    Back
                </Link>
            </div>

            <form onSubmit={submit} className="rm-card p-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Name" error={errors.name} required>
                        <input
                            type="text"
                            className="rm-input w-full px-4"
                            value={data.name}
                            placeholder="Nama dokter"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </Field>

                    <Field label="Specialist" error={errors.specialist} required>
                        <select
                            className="rm-input w-full px-4"
                            value={data.specialist}
                            onChange={(e) => setData("specialist", e.target.value)}
                        >
                            <option value="">Select Specialist</option>

                            {specialists.map((specialist) => (
                                <option key={specialist} value={specialist}>
                                    {specialist}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Phone" error={errors.phone}>
                        <input
                            type="text"
                            className="rm-input w-full px-4"
                            value={data.phone}
                            placeholder="Contoh: 081234567890"
                            onChange={(e) => setData("phone", e.target.value)}
                        />
                    </Field>

                    <Field label="Email" error={errors.email} required>
                        <input
                            type="email"
                            className="rm-input w-full px-4"
                            value={data.email}
                            placeholder="doctor@klinik.test"
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </Field>

                    <Field label="Password" error={errors.password} required>
                        <input
                            type="password"
                            className="rm-input w-full px-4"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                        />
                    </Field>

                    <Field label="Confirm Password" error={errors.password_confirmation} required>
                        <input
                            type="password"
                            className="rm-input w-full px-4"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                        />
                    </Field>

                    <Field label="Address" error={errors.address}>
                        <textarea
                            className="min-h-28 w-full border border-[var(--rm-hairline)] bg-[var(--rm-surface)] p-4 text-[var(--rm-ink)]"
                            value={data.address}
                            placeholder="Alamat praktik atau domisili"
                            onChange={(e) => setData("address", e.target.value)}
                        />
                    </Field>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rm-button inline-flex items-center px-5 disabled:opacity-60"
                    >
                        Save Doctor
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}

function Field({
    label,
    error,
    required = false,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[var(--rm-ink)]">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {children}

            {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
        </div>
    );
}
