import { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import "../styles/style.css";
import { counterData } from "../svg/Icons";

const CounterUp = () => {
  const [countOn, setCountOn] = useState(false); // Tracks if the animation is running
  const [hasExited, setHasExited] = useState(false); // Tracks if it has exited
  const triggerRef = useRef(null); // Ref to track the element

  useEffect(() => {
    const currentRef = triggerRef.current; // Copy the ref value to a stable variable

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasExited(false); // Reset exit state
            setCountOn(false); // Reset to false before re-triggering animation
            setTimeout(() => {
              setCountOn(true); // Start counting when entering the viewport
            }, 100); // Adding a small delay to reset
          } else {
            setCountOn(false); // Stop counter when exiting the viewport
            setHasExited(true); // Mark as exited to keep the number visible
          }
        });
      },
      { threshold: 0.5 }, // Trigger when 50% of the component is in the viewport
    );

    if (currentRef) {
      observer.observe(currentRef); // Observe the component
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Clean up on component unmount
      }
    };
  }, []);

  return (
    <div className="mt-10" ref={triggerRef}>
      <div className="flex flex-wrap items-center justify-center gap-10 p-1 text-center font-bold sm:justify-between sm:gap-[16px] md:gap-10">
        {counterData.map((cd, index) => (
          <div
            key={index}
            data-aos="zoom-in-up"
            className="hexagon flex flex-col items-center justify-center gap-3 border-2 border-secondary shadow-[0px_0px_5px_2px] shadow-primary"
          >
            <div dangerouslySetInnerHTML={{ __html: cd.svg }} />
            <h3 className="text-5xl font-bold">
              <span className="font-dosis">
                {countOn || hasExited ? (
                  <CountUp
                    start={0}
                    end={cd.number}
                    duration={5}
                    delay={0}
                    preserveValue // Preserve value when stopping
                  />
                ) : null}
              </span>
              +
            </h3>
            <p className="w-1/2 font-edu">{cd.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterUp;
