import TextScramble from "../animation/TextScramble";
import TextReveal from "../animation/TextReveal";
import LottieFiles from "../animation/LottieFiles";
import faq from "../../public/Faq.json";
import Unhidden from "../animation/Unhidden";
import Reveal from "../animation/Reveal";
import { IoIosArrowForward } from "react-icons/io";
import { Faqs } from "./Menus";
import "../styles/style.css";
import { useEffect } from "react";

const Faq = () => {
  useEffect(() => {
    const accordions = document.querySelectorAll(".accordion");
    accordions[0].classList.add("expend");
    accordions.forEach((acco) => {
      acco.onclick = () => {
        accordions.forEach((subAcco) => {
          subAcco.classList.remove("expend");
        });
        acco.classList.toggle("expend");
      };
    });
  }, []);

  return (
    <div
      className="mx-auto w-[90%] bg-white py-20 pt-32 dark:bg-secondary"
      id="Faq"
    >
      <div className="flex justify-center">
        <Reveal>
          <TextScramble>Faq Section</TextScramble>
        </Reveal>
      </div>
      <div className="relative mx-auto mb-10 font-semibold sm:w-3/4 md:mb-14 lg:w-1/2">
        <Unhidden>
          <TextReveal>
            Find answers on submitting, managing, and checking assignments
            seamlessly on our online study platform.
          </TextReveal>
        </Unhidden>
      </div>
      <div className="flex flex-col items-center justify-between gap-10 sm:gap-20 lg:flex-row">
        <LottieFiles
          animation={faq}
          className={"w-[20rem] sm:w-[30rem] md:w-[35rem] lg:w-[55vw]"}
        />
        <div className="accordion-container">
          {Faqs.map((faq, index) => (
            <div
              key={index}
              className="accordion mb-5 cursor-pointer lg:w-[40vw]"
            >
              <div className="accordion-heading flex items-center justify-between gap-3 rounded-2xl border-2 border-secondary px-5 py-4 font-dosis text-2xl font-bold text-secondary shadow-[0px_0px_5px_2px] shadow-primary hover:bg-primary dark:text-white dark:hover:text-secondary sm:text-3xl">
                <h3>{faq.title}</h3>
                <IoIosArrowForward className="i w-10" />
              </div>
              <p className="accordion-content rounded-b-3xl border-x-2 border-b-2 border-secondary bg-white px-5 py-5 text-justify font-edu text-lg font-medium text-secondary shadow-[0px_0px_5px_2px] shadow-primary dark:bg-secondary dark:text-white sm:text-xl">
                {faq.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
