import { Calendar } from "primereact/calendar";
import { useState } from "react";
import "../styles/style.css"

const DatePicker = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <label htmlFor="buttondisplay" className="mb-2 block font-bold font-dosis text-secondary dark:text-white">
          Button Display
        </label>
        <Calendar
          id="buttondisplay"
          value={date}
          onChange={(e) => setDate(e.value as Date | null)}
          placeholder="Date"
          showIcon
        />
      </div>
    </div>
  );
};

export default DatePicker;
