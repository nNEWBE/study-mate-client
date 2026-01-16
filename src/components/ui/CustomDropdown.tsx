import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiCheck } from "react-icons/hi";
import { TbSelector } from "react-icons/tb";

interface DropdownOption {
    value: string;
    label: string;
    id?: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: DropdownOption | null;
    onChange: (option: DropdownOption) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select option",
    className = "",
    error
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-12 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm shadow-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          ${error
                        ? "border-red-500 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1f2937] dark:text-gray-100 dark:hover:bg-[#374151]"
                    }
        `}
            >
                <span className={`block truncate ${!value ? "text-gray-500 dark:text-gray-400" : ""}`}>
                    {value ? value.label : placeholder}
                </span>
                <TbSelector className="ml-2 h-4 w-4 shrink-0 opacity-50 transition-opacity hover:opacity-100" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-[#1f2937]"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`relative flex cursor-default select-none items-center rounded-sm py-2.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-[#374151]
                  ${value?.value === option.value
                                        ? "bg-gray-100 font-medium text-gray-900 dark:bg-[#374151] dark:text-white"
                                        : "text-gray-700 dark:text-gray-200"
                                    }`}
                            >
                                <span className="block truncate">{option.label}</span>
                                {value?.value === option.value && (
                                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center text-primary">
                                        <HiCheck className="h-4 w-4" />
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs font-medium text-red-500"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default CustomDropdown;
