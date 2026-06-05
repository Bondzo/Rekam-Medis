import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c69d4] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-black',
    {
        variants: {
            variant: {
                default: 'bg-[#1c69d4] text-white hover:bg-[#0653b6]',
                destructive: 'bg-red-600 text-white hover:bg-red-500',
                outline:
                    'border border-[#cccccc] bg-transparent text-[#262626] hover:border-[#1c69d4] hover:text-[#1c69d4] dark:border-[#3c3c3c] dark:text-white dark:hover:border-[#1c69d4] dark:hover:text-white',
                secondary:
                    'border border-[#e6e6e6] bg-[#fafafa] text-[#262626] hover:bg-[#ebebeb] dark:border-[#3c3c3c] dark:bg-[#1a1a1a] dark:text-[#e6e6e6] dark:hover:bg-[#262626]',
                ghost: 'text-[#262626] hover:bg-[#f7f7f7] hover:text-black dark:text-[#e6e6e6] dark:hover:bg-[#1a1a1a] dark:hover:text-white',
                link: 'text-[#1c69d4] underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 px-3',
                lg: 'h-12 px-6',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
