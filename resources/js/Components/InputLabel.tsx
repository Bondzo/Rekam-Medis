import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-normal text-gray-700 dark:text-[#bbbbbb] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
