import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex min-h-12 items-center border border-gray-300 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[1.5px] text-gray-900 shadow-none transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-25 dark:border-[#3c3c3c] dark:bg-black dark:text-white dark:hover:bg-[#1a1a1a] dark:focus:ring-white dark:focus:ring-offset-black ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
