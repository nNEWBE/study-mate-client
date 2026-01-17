import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    required?: boolean;
    error?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            required = false,
            error,
            icon,
            iconPosition = 'right',
            size = 'md',
            variant = 'default',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-3',
            lg: 'px-4 py-4 text-lg',
        };

        const variantClasses = {
            default: `border-primary bg-primary/5 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]`,
            filled: `border-primary/50 bg-white hover:border-primary focus:border-primary dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40`,
        };

        return (
            <div className={className}>
                {/* Label */}
                {label && (
                    <label className="mb-2 block font-edu font-semibold text-secondary dark:text-white">
                        {label} {required && <span className="text-primary">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon */}
                    {icon && iconPosition === 'left' && (
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary dark:text-white">
                            {icon}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        disabled={disabled}
                        className={`
              w-full rounded-xl border-2 font-semibold text-secondary 
              placeholder-secondary/70 outline-none transition-all
              dark:text-white dark:placeholder-white/70
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-12' : ''}
              ${error ? 'border-red-400 focus:border-red-400' : ''}
              ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            `}
                        {...props}
                    />

                    {/* Right Icon */}
                    {icon && iconPosition === 'right' && (
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary dark:text-white">
                            {icon}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-1 flex items-center gap-1 font-poppins text-sm text-red-500">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
