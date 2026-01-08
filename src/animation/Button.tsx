import "../styles/style.css";
import { useState, useRef, MouseEvent, CSSProperties } from "react";

interface ButtonProps {
  str: string;
  shadow?: boolean;
}

interface CustomCSSProperties extends CSSProperties {
  "--x"?: string;
  "--y"?: string;
  "--char-index"?: number;
}

const Button = ({ str, shadow }: ButtonProps): JSX.Element => {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouse = (e: MouseEvent<HTMLButtonElement>): void => {
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setX(e.clientX - rect.left);
      setY(e.clientY - rect.top);
    }
  };

  const arr = str.split("");

  const buttonStyle: CustomCSSProperties = {
    "--x": `${x}px`,
    "--y": `${y}px`,
  };

  return (
    <button
      type="submit"
      ref={btnRef}
      onMouseMove={handleMouse}
      className={`relative border-2 bg-white ${shadow ? "shadow-[0_0_5px_2px] shadow-primary" : ""
        } button w-full h-full rounded-xl border-black px-5 py-2 font-poppins sm:text-lg lg:text-xl font-bold`}
      style={buttonStyle}
    >
      <span>
        {arr.map((letter, index) => {
          if (letter === " ") {
            return " ";
          } else {
            const charStyle: CustomCSSProperties = { "--char-index": index };
            return (
              <span
                key={index}
                className="char"
                data-char={letter}
                style={charStyle}
              >
                {letter}
              </span>
            );
          }
        })}
      </span>
    </button>
  );
};

export default Button;
