import PropTypes from "prop-types";
import "../styles/style.css";
import { useState, useRef } from "react";

const Button = ({ str, shadow }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const btnRef = useRef(null);

  const handleMouse = (e) => {
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setX(e.clientX - rect.left);
      setY(e.clientY - rect.top);
    }
  };

  const arr = str.split("");

  return (
    <button
      type="submit"
      ref={btnRef}
      onMouseMove={handleMouse}
      className={`relative border-2 bg-white ${
        shadow ? "shadow-[0_0_5px_2px] shadow-primary" : ""
      } button w-full h-full rounded-xl border-black px-5 py-2 font-poppins sm:text-lg lg:text-xl font-bold`}
      style={{
        "--x": `${x}px`,
        "--y": `${y}px`,
      }}
    >
      <span>
        {arr.map((letter, index) => {
          if (letter === " ") {
            return " ";
          } else
            return (
              <span
                key={index}
                className="char"
                data-char={letter}
                style={{ "--char-index": index }}
              >
                {letter}
              </span>
            );
        })}
      </span>
    </button>
  );
};

Button.propTypes = {
  str: PropTypes.string.isRequired,
  shadow: PropTypes.bool,
};

export default Button;
