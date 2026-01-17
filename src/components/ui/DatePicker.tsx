import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward, IoCalendarOutline } from "react-icons/io5";

interface DatePickerProps {
    label?: string;
    required?: boolean;
    error?: string;
    value?: string;
    onChange?: (date: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    name?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    (
        {
            label,
            required = false,
            error,
            value,
            onChange,
            placeholder = "Select date",
            disabled = false,
            minDate,
            maxDate,
            className = "",
            name,
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [selectedDate, setSelectedDate] = useState<Date | null>(
            value ? new Date(value) : null
        );
        const containerRef = useRef<HTMLDivElement>(null);

        // Parse value prop when it changes
        useEffect(() => {
            if (value) {
                const parsed = new Date(value);
                if (!isNaN(parsed.getTime())) {
                    setSelectedDate(parsed);
                    setCurrentMonth(parsed);
                }
            }
        }, [value]);

        // Close on outside click
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const getDaysInMonth = (date: Date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();

            const days: { date: Date; isCurrentMonth: boolean }[] = [];

            // Previous month days
            for (let i = firstDay - 1; i >= 0; i--) {
                days.push({
                    date: new Date(year, month - 1, daysInPrevMonth - i),
                    isCurrentMonth: false,
                });
            }

            // Current month days
            for (let i = 1; i <= daysInMonth; i++) {
                days.push({
                    date: new Date(year, month, i),
                    isCurrentMonth: true,
                });
            }

            // Next month days
            const remaining = 42 - days.length;
            for (let i = 1; i <= remaining; i++) {
                days.push({
                    date: new Date(year, month + 1, i),
                    isCurrentMonth: false,
                });
            }

            return days;
        };

        const handleDateSelect = (date: Date) => {
            setSelectedDate(date);
            setIsOpen(false);
            if (onChange) {
                // Format as YYYY-MM-DD for form compatibility
                const formatted = date.toISOString().split("T")[0];
                onChange(formatted);
            }
        };

        const isDateDisabled = (date: Date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
        };

        const isToday = (date: Date) => {
            const today = new Date();
            return date.toDateString() === today.toDateString();
        };

        const isSelected = (date: Date) => {
            return selectedDate && date.toDateString() === selectedDate.toDateString();
        };

        const prevMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        };

        const nextMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        };

        const formatDisplayDate = (date: Date | null) => {
            if (!date) return "";
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        };

        return (
            <div ref={containerRef} className={`relative ${className}`}>
                {/* Hidden input for form compatibility */}
                <input
                    ref={ref}
                    type="hidden"
                    name={name}
                    value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                />

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
                        : selectedDate
                            ? "border-primary bg-primary/5 text-secondary dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white"
                            : "border-primary bg-primary/5 text-secondary/60 hover:border-primary hover:bg-primary/10 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white/60"
                        } ${error ? "border-red-400" : ""}`}
                >
                    <span>{selectedDate ? formatDisplayDate(selectedDate) : placeholder}</span>
                    <IoCalendarOutline className="h-5 w-5 text-secondary dark:text-white" />
                </button>

                {/* Calendar Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-xl border border-primary/30 bg-white p-4 dark:border-white/10 dark:bg-secondary"
                        >
                            {/* Month Navigation */}
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                >
                                    <IoChevronBack />
                                </button>
                                <span className="font-dosis text-lg font-bold text-secondary dark:text-white">
                                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                >
                                    <IoChevronForward />
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div className="mb-2 grid grid-cols-7 gap-1">
                                {DAYS.map((day) => (
                                    <div
                                        key={day}
                                        className="py-1 text-center font-edu text-xs font-bold text-secondary/60 dark:text-white/60"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {getDaysInMonth(currentMonth).map((day, index) => {
                                    const isDisabled = isDateDisabled(day.date);
                                    const selected = isSelected(day.date);
                                    const today = isToday(day.date);

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => !isDisabled && day.isCurrentMonth && handleDateSelect(day.date)}
                                            disabled={isDisabled || !day.isCurrentMonth}
                                            className={`flex h-9 w-full items-center justify-center rounded-lg font-dosis text-sm font-semibold transition-all ${!day.isCurrentMonth
                                                ? "text-secondary/30 dark:text-white/20"
                                                : isDisabled
                                                    ? "cursor-not-allowed text-secondary/30 dark:text-white/20"
                                                    : selected
                                                        ? "bg-primary text-secondary shadow-[0_0_8px_2px] border-2 border-secondary shadow-primary"
                                                        : today
                                                            ? "border-2 border-primary text-primary"
                                                            : "text-secondary hover:bg-primary/10 dark:text-white dark:hover:bg-white/10"
                                                }`}
                                        >
                                            {day.date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Today Button */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const today = new Date();
                                        setCurrentMonth(today);
                                        handleDateSelect(today);
                                    }}
                                    className="rounded-lg border-2 border-primary bg-primary/10 px-4 py-1.5 font-dosis text-sm font-bold text-secondary transition-all hover:bg-primary/20 dark:text-white"
                                >
                                    Today
                                </button>
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
    }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
