import DashboardLayout from "../../Layouts/DashboardLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post("/staff");
    }

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Add Staff</h1>

                <Link href="/staff" className="rm-button-outline inline-flex min-h-11 items-center px-5">
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
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </Field>

                    <Field label="Email" error={errors.email} required>
                        <input
                            type="email"
                            className="rm-input w-full px-4"
                            value={data.email}
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
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rm-button inline-flex items-center px-5 disabled:opacity-60"
                    >
                        Save Staff
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
