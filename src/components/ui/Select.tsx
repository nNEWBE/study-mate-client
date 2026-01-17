import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
    value: string;
    label: string;
    icon?: ReactNode;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    loading?: boolean;
    searchable?: boolean;
    className?: string;
}

const Select = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    label,
    required = false,
    error,
    disabled = false,
    loading = false,
    searchable = false,
    className = "",
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Filter options based on search
    const filteredOptions = searchable && searchQuery
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Label */}
            {label && (
                <label className="mb-2 block font-edu font-semibold text-secondary dark:text-white">
                    {label} {required && <span className="text-primary">*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`group flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 font-semibold transition-all duration-200 ${disabled
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-white/40"
                    : selectedOption
                        ? "border-primary bg-primary/5 text-secondary dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white"
                        : "border-primary bg-primary/5 text-secondary/60 hover:border-primary hover:bg-primary/10 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white/60 dark:hover:border-white/40"
                    } ${error ? "border-red-400" : ""}`}
            >
                <div className="flex items-center gap-2">
                    {selectedOption && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-xs text-secondary">
                            ✓
                        </span>
                    )}
                    <span className={selectedOption ? "text-secondary dark:text-white" : ""}>
                        {loading ? "Loading..." : selectedOption?.label || placeholder}
                    </span>
                </div>
                <svg
                    className={`h-6 w-6 text-secondary transition-transform duration-200 dark:text-white ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-xl border border-primary/30 bg-white dark:border-white/10 dark:bg-secondary"
                    >
                        {/* Search Header */}
                        {searchable && (
                            <div className="border-b border-primary/20 p-2 dark:border-white/10">
                                <div className="flex items-center font-dosis gap-2 rounded-lg bg-primary/10 px-3 py-2 dark:bg-white/5">
                                    <svg className="h-4 w-4 text-secondary/60 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full bg-transparent text-sm font-semibold text-secondary outline-none placeholder:text-secondary/50 dark:text-white dark:placeholder:text-white/40"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="max-h-48 overflow-auto p-1 custom-scrollbar">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-6 text-center text-sm font-semibold text-secondary/50 dark:text-white/40">
                                    {searchQuery ? "No results found" : "No options available"}
                                </div>
                            ) : (
                                filteredOptions.map((option) => {
                                    const isSelected = value === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${isSelected
                                                ? "bg-primary/20 text-secondary dark:text-white"
                                                : "text-secondary hover:bg-primary/10 dark:text-white dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected
                                                        ? "bg-primary text-secondary"
                                                        : "bg-primary/10 text-secondary dark:bg-white/10 dark:text-white"
                                                        }`}
                                                >
                                                    {option.icon || (
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span>{option.label}</span>
                                            </div>

                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                                                >
                                                    <svg className="h-3 w-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-primary/20 px-3 py-2 dark:border-white/10">
                            <p className="text-xs font-edu font-bold text-secondary/60 dark:text-white/40">
                                {filteredOptions.length} {filteredOptions.length === 1 ? "option" : "options"} available
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
};

export default Select;
