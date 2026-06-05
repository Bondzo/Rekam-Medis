import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Lock, LogIn, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--rm-canvas)] px-5 py-10 text-[var(--rm-body)]">
            <Head title="Masuk" />

            <div className="w-full max-w-md border border-[var(--rm-hairline)] bg-gradient-to-b from-[var(--rm-surface-elevated)] to-[var(--rm-surface)] p-8 text-[var(--rm-ink)] dark:bg-none sm:p-10">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--rm-hairline)] bg-[var(--rm-surface)] text-[var(--rm-ink)]">
                        <LogIn className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--rm-ink)]">
                        Masuk dengan email
                    </h2>
                    <p className="mt-4 max-w-xs text-sm font-light leading-6 text-[var(--rm-muted)]">
                        Gunakan akun klinik untuk melanjutkan ke sistem rekam
                        medis.
                    </p>
                </div>

                {status && (
                    <div className="mb-5 border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rm-muted)]"
                                aria-hidden="true"
                            />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block min-h-12 w-full border border-[var(--rm-hairline)] bg-[var(--rm-surface)] px-11 py-3 text-sm font-light text-[var(--rm-ink)] placeholder:text-[var(--rm-muted)] focus:border-[var(--rm-ink)] focus:ring-[var(--rm-ink)]"
                                placeholder="Email"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rm-muted)]"
                                aria-hidden="true"
                            />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block min-h-12 w-full border border-[var(--rm-hairline)] bg-[var(--rm-surface)] px-11 py-3 text-sm font-light text-[var(--rm-ink)] placeholder:text-[var(--rm-muted)] focus:border-[var(--rm-ink)] focus:ring-[var(--rm-ink)]"
                                placeholder="Password"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <button
                        type="submit"
                        className="flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--rm-action)] px-6 py-3 text-sm font-bold uppercase tracking-[0.5px] text-white transition hover:bg-[var(--rm-action-active)] focus:outline-none focus:ring-2 focus:ring-[var(--rm-ink)] focus:ring-offset-2 focus:ring-offset-[var(--rm-surface)] disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={processing}
                    >
                        Masuk
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </form>

                <div className="mt-7 border-t border-[var(--rm-hairline)] pt-6 text-center">
                    <p className="text-sm font-light text-[var(--rm-muted)]">
                        Belum punya akun?
                    </p>
                    <Link
                        href={route('register')}
                        className="mt-4 inline-flex min-h-12 w-full items-center justify-center border border-[var(--rm-hairline-strong)] px-6 text-sm font-bold uppercase tracking-[0.5px] text-[var(--rm-ink)] transition hover:border-[var(--rm-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rm-ink)] focus:ring-offset-2 focus:ring-offset-[var(--rm-surface)]"
                    >
                        Daftar Akun
                    </Link>
                </div>
            </div>
        </main>
    );
}
