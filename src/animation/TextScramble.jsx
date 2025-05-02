import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

const TextScramble = ({ children: text }) => {
  const [scrambled, setScrambled] = useState("");
  const textRef = useRef(null);
  const scrambleTimeout = useRef(null);

  const startScramble = useCallback(() => {
    const scramble = (iterations) => {
      scrambleTimeout.current = setTimeout(() => {
        const newText = text
          ?.split("")
          ?.map((char) => {
            if (Math.random() < iterations / 10) {
              return char;
            }
            return getRandomChar();
          })
          .join("");

        setScrambled(newText);

        if (iterations > 0) {
          scramble(iterations - 1);
        } else {
          setScrambled(text);
        }
      }, 35);
    };

    scramble(10);
  }, [text]);

  const getRandomChar = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  useEffect(() => {
    const currentRef = textRef.current; // Store textRef.current in a variable

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScramble();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      clearTimeout(scrambleTimeout.current);
    };
  }, [startScramble]);

  return (
    <h1
      ref={textRef}
      className="font-dosis text-4xl mb-7 sm:text-5xl font-bold text-secondary text-center dark:text-white"
    >
      {scrambled?scrambled:text}
      <span className="text-5xl text-primary">.</span>
    </h1>
  );
};

export default TextScramble;

TextScramble.propTypes = {
  children: PropTypes.string.isRequired,
};
