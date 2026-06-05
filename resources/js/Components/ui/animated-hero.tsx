import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    MoveRight,
    Stethoscope,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/Components/ui/button';

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ['pasien', 'antrean', 'pemeriksaan', 'resep', 'pembayaran'],
        [],
    );

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setTitleNumber((current) => (current + 1) % titles.length);
        }, 2000);

        return () => window.clearTimeout(timeoutId);
    }, [titleNumber, titles.length]);

    return (
        <div className="w-full">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
                <header className="flex items-center justify-between gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-none border border-[#e6e6e6] bg-[#fafafa] text-[#1c69d4] dark:border-[#3c3c3c] dark:bg-[#1a1a1a] dark:text-[#f5f6f9]">
                            <Stethoscope className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#262626] dark:text-white">
                                Sistem Rekam Medis Klinik
                            </p>
                            <p className="hidden text-xs text-[#3c3c3c] dark:text-[#bbbbbb] sm:block">
                                Modern clinic management system
                            </p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={route('login')}>Login</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hidden sm:inline-flex"
                        >
                            <Link href={route('register')}>Register</Link>
                        </Button>
                    </nav>
                </header>

                <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pb-8 pt-8 text-center sm:gap-7 lg:pt-10">
                    <div className="flex max-w-5xl flex-col items-center gap-4 sm:gap-5">
                        <h1 className="max-w-5xl text-3xl font-bold leading-[1.08] text-[#262626] sm:text-4xl lg:text-6xl dark:text-white">
                            <span>
                                Kelola Rekam Medis Klinik dengan Lebih Cepat dan
                                Terstruktur
                            </span>
                                <span className="relative mt-2 flex h-[1.15em] w-full justify-center overflow-hidden text-center text-3xl text-[#ffffff] sm:text-4xl lg:text-5xl dark:text-[#ffffff] mix-blend-difference z-10">

                                {titles.map((title, index) => (
                                    <motion.span
                                        key={title}
                                        className="absolute font-bold"
                                        initial={{ opacity: 0, y: '-100%' }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 60,
                                            damping: 16,
                                        }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                      y: 0,
                                                      opacity: 1,
                                                  }
                                                : {
                                                      y:
                                                          titleNumber > index
                                                              ? '-130%'
                                                              : '130%',
                                                      opacity: 0,
                                                  }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="max-w-[700px] text-base leading-7 text-[#3c3c3c] sm:text-lg sm:leading-8 dark:text-[#bbbbbb]">
                            Satu sistem terpadu untuk membantu klinik mengelola
                            pendaftaran pasien, antrean dokter, rekam medis,
                            resep obat, dan pembayaran secara efisien.
                        </p>
                    </div>

                    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                    </div>
                </section>
            </div>
        </div>
    );
}

export { Hero };
