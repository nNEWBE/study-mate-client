import Reveal from "../animation/Reveal";
import TextReveal from "../animation/TextReveal";
import TextScramble from "../animation/TextScramble";
import Unhidden from "../animation/Unhidden";
import "../styles/style.css";
import { bestAssignments } from "./Menus";
import { FaStar } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import {
  BsCalendarDateFill,
  BsFillFileEarmarkBarGraphFill,
} from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { ToggleContext } from "../context/ToggleProvider";
import BestCardSkeleton from "../animation/BestCardSkeleton";

const BestAssignments = () => {
  const context = useContext(ToggleContext);
  const theme = context?.theme;
  const [data, setData] = useState(bestAssignments);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setData(bestAssignments)
    setTimeout(() => setIsLoading(false), 1500);
  }, [])

  return (
    <div className="w-full bg-white pt-32 dark:bg-secondary">
      <div className="mx-auto w-[90%] max-w-7xl" id="Best">
        <div className="h-full">
          <div className="sticky top-28 mb-5 sm:mb-0">
            <div className="flex justify-center">
              <Reveal>
                <TextScramble>Best Assignments</TextScramble>
              </Reveal>
            </div>

            <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
              <Unhidden>
                <TextReveal>
                  Explore top-rated assignments showcasing exceptional research,
                  coding skills, and innovative solutions.
                </TextReveal>
              </Unhidden>
            </div>
          </div>

          {isLoading ? (
            <BestCardSkeleton cards={bestAssignments.length} />
          ) : (
            data.map((bs, index) => (
              <div key={index} className="sticky top-20 pt-7 sm:top-72" data-cursor="card">
                <Tilt
                  glareEnable={false}
                  tiltMaxAngleY={5}
                  tiltMaxAngleX={5}
                  glareBorderRadius="10px"
                  className="relative mx-auto flex flex-col justify-between gap-5 overflow-hidden rounded-xl border-2 border-secondary bg-white p-5 shadow-[0px_0px_5px_2px] shadow-primary dark:bg-secondary sm:h-[17rem] sm:flex-row lg:h-[20rem] lg:w-[60rem]"
                >
                  <div className="shrink-0 sm:w-[40%] lg:w-[35%]">
                    <img
                      src={bs.image}
                      alt={bs.title}
                      className="h-full w-full rounded-xl object-cover shadow-[0px_0px_15px_2px] shadow-primary"
                    />
                  </div>
                  <div className="flex flex-col justify-between sm:w-[60%] lg:w-[65%] lg:py-7">
                    <div className="text-secondary dark:text-white">
                      <h1 className="font-dosis text-2xl font-bold">
                        {bs.title}{" "}
                        <span className="text-xl font-bold text-primary md:text-4xl">
                          .
                        </span>
                      </h1>
                      <p className="my-3 mb-5 font-edu text-sm font-medium sm:mb-3 sm:text-sm md:text-base">
                        {bs.description}
                      </p>
                    </div>
                    <hr className="hidden border-[1px] border-secondary shadow-[0px_0px_5px_2px] shadow-primary sm:block" />
                    <div className="icons-container flex flex-wrap items-center justify-between gap-2 font-edu text-xs font-medium md:text-sm lg:text-base">
                      <div className="gaps flex items-center gap-2">
                        <div className="icon-overlap hidden rounded-xl border-2 border-secondary bg-white p-2 shadow-[0px_0px_5px_2px] shadow-primary sm:block md:hidden lg:block">
                          <BsFillFileEarmarkBarGraphFill />
                        </div>
                        <p className="inline rounded-xl border-2 border-secondary bg-white p-1 px-2 shadow-[0px_0px_5px_2px] shadow-primary sm:hidden md:block">
                          Marks
                        </p>
                        <span className="text-secondary dark:text-white">
                          {" "}
                          : {bs.marks}
                        </span>
                      </div>
                      <div className="gaps flex items-center gap-2">
                        <div className="icon-overlap hidden rounded-xl border-2 border-secondary bg-white p-2 shadow-[0px_0px_5px_2px] shadow-primary sm:block md:hidden lg:block">
                          <FaStar />
                        </div>
                        <p className="inline rounded-xl border-2 border-secondary bg-white p-1 px-2 shadow-[0px_0px_5px_2px] shadow-primary sm:hidden md:block">
                          Rating
                        </p>
                        <span className="text-secondary dark:text-white">
                          {" "}
                          : {bs.rating}
                        </span>
                      </div>
                      <div className="gaps flex items-center gap-2">
                        <div className="icon-overlap hidden rounded-xl border-2 border-secondary bg-white p-2 shadow-[0px_0px_5px_2px] shadow-primary sm:block md:hidden lg:block">
                          <BsCalendarDateFill />
                        </div>
                        <p className="inline rounded-xl border-2 border-secondary bg-white p-1 px-2 shadow-[0px_0px_5px_2px] shadow-primary sm:hidden md:block">
                          Submitted
                        </p>
                        <span className="text-secondary dark:text-white">
                          {" "}
                          : {bs.dateOfPublishing}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BestAssignments;
