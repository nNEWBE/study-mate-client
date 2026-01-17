import { forwardRef, TextareaHTMLAttributes, ReactNode } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    required?: boolean;
    error?: string;
    icon?: ReactNode;
    helperText?: string;
    showCount?: boolean;
    maxCount?: number;
    currentCount?: number;
    variant?: 'default' | 'filled';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            required = false,
            error,
            icon,
            helperText,
            showCount = false,
            maxCount,
            currentCount = 0,
            variant = 'default',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const isOverLimit = maxCount ? currentCount > maxCount : false;

        const variantClasses = {
            default: `border-primary bg-primary/5 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]`,
            filled: `border-primary/50 bg-white hover:border-primary focus:border-primary dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40`,
        };

        return (
            <div className={className}>
                {/* Label Row */}
                {(label || showCount) && (
                    <div className="mb-2 flex items-center justify-between">
                        {label && (
                            <label className="font-edu font-semibold text-secondary dark:text-white">
                                {label} {required && <span className="text-primary">*</span>}
                            </label>
                        )}
                        {showCount && maxCount && (
                            <span className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : 'text-secondary/60 dark:text-white/60'}`}>
                                {currentCount}/{maxCount}
                            </span>
                        )}
                    </div>
                )}

                {/* Textarea Container */}
                <div className="relative">
                    <textarea
                        ref={ref}
                        disabled={disabled}
                        className={`
              w-full resize-none rounded-xl border-2 px-4 py-3 font-semibold 
              text-secondary placeholder-secondary/70 outline-none transition-all
              dark:text-white dark:placeholder-white/70
              ${variantClasses[variant]}
              ${icon ? 'pr-12' : ''}
              ${error || isOverLimit ? 'border-red-400 focus:border-red-400' : ''}
              ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            `}
                        {...props}
                    />

                    {/* Icon */}
                    {icon && (
                        <div className="pointer-events-none absolute right-3 top-3 text-secondary dark:text-white">
                            {icon}
                        </div>
                    )}
                </div>

                {/* Helper Text or Error */}
                {(helperText || error) && (
                    <p className={`mt-1 flex items-center gap-1 font-poppins text-sm ${error ? 'text-red-500' : 'text-secondary/60 dark:text-white/60'}`}>
                        {error && (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
