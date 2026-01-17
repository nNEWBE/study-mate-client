import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoTimeOutline, IoChevronUp, IoChevronDown } from "react-icons/io5";

interface TimePickerProps {
    label?: string;
    required?: boolean;
    error?: string;
    value?: string; // 24-hour format: "HH:mm"
    onChange?: (time: string) => void; // Returns 24-hour format
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    name?: string;
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
    (
        {
            label,
            required = false,
            error,
            value = "23:59",
            onChange,
            placeholder = "Select time",
            disabled = false,
            className = "",
            name,
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        // Parse 24-hour time to 12-hour format
        const parse24HourTo12Hour = (time24: string) => {
            const [hoursStr, minutesStr] = time24.split(":");
            let hours = parseInt(hoursStr || "23", 10);
            const minutes = parseInt(minutesStr || "59", 10);
            const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";

            if (hours === 0) hours = 12;
            else if (hours > 12) hours -= 12;

            return { hours, minutes, period };
        };

        // Convert 12-hour to 24-hour format
        const convert12HourTo24Hour = (hours: number, minutes: number, period: "AM" | "PM"): string => {
            let hour24 = hours;
            if (period === "AM") {
                if (hours === 12) hour24 = 0;
            } else {
                if (hours !== 12) hour24 = hours + 12;
            }
            return `${hour24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };

        const initialParsed = parse24HourTo12Hour(value);
        const [hours, setHours] = useState(initialParsed.hours);
        const [minutes, setMinutes] = useState(initialParsed.minutes);
        const [period, setPeriod] = useState<"AM" | "PM">(initialParsed.period);

        // Update local state when value prop changes
        useEffect(() => {
            const parsed = parse24HourTo12Hour(value);
            setHours(parsed.hours);
            setMinutes(parsed.minutes);
            setPeriod(parsed.period);
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

        const handleHoursChange = (delta: number) => {
            let newHours = hours + delta;
            if (newHours > 12) newHours = 1;
            if (newHours < 1) newHours = 12;
            setHours(newHours);
            emitChange(newHours, minutes, period);
        };

        const handleMinutesChange = (delta: number) => {
            let newMinutes = minutes + delta;
            if (newMinutes >= 60) newMinutes = 0;
            if (newMinutes < 0) newMinutes = 59;
            setMinutes(newMinutes);
            emitChange(hours, newMinutes, period);
        };

        const handlePeriodToggle = () => {
            const newPeriod = period === "AM" ? "PM" : "AM";
            setPeriod(newPeriod);
            emitChange(hours, minutes, newPeriod);
        };

        const emitChange = (h: number, m: number, p: "AM" | "PM") => {
            if (onChange) {
                const time24 = convert12HourTo24Hour(h, m, p);
                onChange(time24);
            }
        };

        const formatDisplayTime = () => {
            const h = hours.toString().padStart(2, "0");
            const m = minutes.toString().padStart(2, "0");
            return `${h}:${m} ${period}`;
        };

        // Local state for input values (allows free typing)
        const [hoursInput, setHoursInput] = useState(hours.toString().padStart(2, "0"));
        const [minutesInput, setMinutesInput] = useState(minutes.toString().padStart(2, "0"));

        // Sync input values when hours/minutes change from arrows or presets
        useEffect(() => {
            setHoursInput(hours.toString().padStart(2, "0"));
        }, [hours]);

        useEffect(() => {
            setMinutesInput(minutes.toString().padStart(2, "0"));
        }, [minutes]);

        const handleHoursInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            setHoursInput(val);
        };

        const handleHoursBlur = () => {
            let num = parseInt(hoursInput, 10);
            if (isNaN(num) || num < 1) num = 1;
            if (num > 12) num = 12;
            setHours(num);
            setHoursInput(num.toString().padStart(2, "0"));
            emitChange(num, minutes, period);
        };

        const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            setMinutesInput(val);
        };

        const handleMinutesBlur = () => {
            let num = parseInt(minutesInput, 10);
            if (isNaN(num) || num < 0) num = 0;
            if (num > 59) num = 59;
            setMinutes(num);
            setMinutesInput(num.toString().padStart(2, "0"));
            emitChange(hours, num, period);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'hours' | 'minutes') => {
            if (e.key === 'Enter') {
                if (type === 'hours') handleHoursBlur();
                else handleMinutesBlur();
                e.currentTarget.blur();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (type === 'hours') handleHoursChange(1);
                else handleMinutesChange(1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (type === 'hours') handleHoursChange(-1);
                else handleMinutesChange(-1);
            }
        };

        return (
            <div ref={containerRef} className={`relative ${className}`}>
                {/* Hidden input for form compatibility */}
                <input
                    ref={ref}
                    type="hidden"
                    name={name}
                    value={convert12HourTo24Hour(hours, minutes, period)}
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
                        : value
                            ? "border-primary bg-primary/5 text-secondary dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white"
                            : "border-primary bg-primary/5 text-secondary/60 hover:border-primary hover:bg-primary/10 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white/60"
                        } ${error ? "border-red-400" : ""}`}
                >
                    <span>{value ? formatDisplayTime() : placeholder}</span>
                    <IoTimeOutline className="h-5 w-5 text-secondary dark:text-white" />
                </button>

                {/* Time Picker Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-xl border border-primary/30 bg-white p-4 dark:border-white/10 dark:bg-secondary"
                        >
                            <div className="flex items-center justify-center gap-2">
                                {/* Hours */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => handleHoursChange(1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        <IoChevronUp />
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={hoursInput}
                                        onChange={handleHoursInput}
                                        onBlur={handleHoursBlur}
                                        onKeyDown={(e) => handleKeyDown(e, 'hours')}
                                        className="my-2 w-14 rounded-lg border-2 border-primary/30 bg-primary/5 py-2 text-center font-dosis text-2xl font-bold text-secondary outline-none transition-all focus:border-primary dark:border-white/20 dark:bg-white/10 dark:text-white"
                                        maxLength={2}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleHoursChange(-1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        <IoChevronDown />
                                    </button>
                                </div>

                                {/* Separator */}
                                <span className="font-dosis text-3xl font-bold text-secondary dark:text-white">:</span>

                                {/* Minutes */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => handleMinutesChange(1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        <IoChevronUp />
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={minutesInput}
                                        onChange={handleMinutesInput}
                                        onBlur={handleMinutesBlur}
                                        onKeyDown={(e) => handleKeyDown(e, 'minutes')}
                                        className="my-2 w-14 rounded-lg border-2 border-primary/30 bg-primary/5 py-2 text-center font-dosis text-2xl font-bold text-secondary outline-none transition-all focus:border-primary dark:border-white/20 dark:bg-white/10 dark:text-white"
                                        maxLength={2}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleMinutesChange(-1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        <IoChevronDown />
                                    </button>
                                </div>

                                {/* AM/PM Toggle */}
                                <div className="ml-2 flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={handlePeriodToggle}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        <IoChevronUp />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePeriodToggle}
                                        className="my-2 flex w-14 cursor-pointer items-center justify-center rounded-lg border-2 border-secondary dark:border-primary bg-primary/20 py-2 font-dosis text-xl font-bold text-secondary shadow-[0_0_8px_1px] shadow-primary transition-all hover:bg-primary/30 dark:text-white"
                                    >
                                        {period}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePeriodToggle}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition-colors hover:bg-primary/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        <IoChevronDown />
                                    </button>
                                </div>
                            </div>

                            {/* Quick Select Buttons */}
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {[
                                    { label: "12:00 AM", h: 12, m: 0, p: "AM" as const },
                                    { label: "9:00 AM", h: 9, m: 0, p: "AM" as const },
                                    { label: "12:00 PM", h: 12, m: 0, p: "PM" as const },
                                    { label: "6:00 PM", h: 6, m: 0, p: "PM" as const },
                                    { label: "11:59 PM", h: 11, m: 59, p: "PM" as const },
                                ].map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => {
                                            setHours(preset.h);
                                            setMinutes(preset.m);
                                            setPeriod(preset.p);
                                            emitChange(preset.h, preset.m, preset.p);
                                        }}
                                        className="rounded-lg border-2 border-primary/50 bg-primary/10 px-3 py-1 font-dosis text-sm font-semibold text-secondary transition-all hover:border-primary hover:bg-primary/20 dark:border-white/20 dark:text-white dark:hover:border-white/40"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>

                            {/* Done Button */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg border-2 border-secondary bg-primary px-6 py-1.5 font-dosis text-sm font-bold text-secondary shadow-[0_0_8px_2px] shadow-primary transition-all hover:bg-primary/90"
                                >
                                    Done
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

TimePicker.displayName = "TimePicker";

export default TimePicker;
