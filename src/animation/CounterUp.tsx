import { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import "../styles/style.css";
import { counterData } from "../svg/Icons";

const CounterUp = (): JSX.Element => {
  const [countOn, setCountOn] = useState<boolean>(false);
  const [hasExited, setHasExited] = useState<boolean>(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = triggerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasExited(false);
            setCountOn(false);
            setTimeout(() => {
              setCountOn(true);
            }, 100);
          } else {
            setCountOn(false);
            setHasExited(true);
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
                    preserveValue
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
