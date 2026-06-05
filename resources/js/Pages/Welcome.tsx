import { Hero } from '@/Components/ui/animated-hero';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function Welcome({}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
}>) {
    return (
        <main className="min-h-screen overflow-hidden bg-white font-sans text-[#262626] dark:bg-black dark:text-white">
            <Head title="Sistem Rekam Medis Klinik" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(28,105,212,0.1),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(0,102,177,0.08),transparent_26%),linear-gradient(135deg,#ffffff_0%,#f7f7f7_52%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(0,102,177,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(28,105,212,0.14),transparent_26%),linear-gradient(135deg,#000000_0%,#0d0d0d_52%,#000000_100%)]" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]" />

            <div className="relative">
                <Hero />
            </div>
        </main>
    );
}
