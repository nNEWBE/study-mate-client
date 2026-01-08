import { useTypewriter, Cursor } from "react-simple-typewriter";
import track from "../../public/Create.json";
import Button from "../animation/Button";
import Reveal from "../animation/Reveal";
import LottieFiles from "../animation/LottieFiles";
import { Link } from "react-router-dom";
import TextScramble from "../animation/TextScramble";
import Unhidden from "../animation/Unhidden";
import TextReveal from "../animation/TextReveal";

const Create = () => {
  const [text] = useTypewriter({
    words: ["Start", "Create", "Begin", "Explore"],
    loop: true,
    typeSpeed: 200,
    delaySpeed: 100,
  });

  return (
    <div className="w-full bg-white dark:bg-secondary pt-32" id="Create">
      <div className="mx-auto w-[90%] max-w-[90rem]">
        <div className="flex justify-center">
          <Reveal>
            <TextScramble>Create Assigments</TextScramble>
          </Reveal>
        </div>
        <div className="relative mx-auto mb-16 sm:w-3/4 lg:w-[45%]">
          <Unhidden>
            <TextReveal>
              Create assignments effortlessly with customizable options,
              deadlines, and detailed instructions for students.
            </TextReveal>
          </Unhidden>
        </div>
        <div className="flex items-center rounded-xl mb-3 border-2 border-secondary bg-[linear-gradient(115deg,_rgba(255,255,255,0)_10%,_rgba(0,255,165,.5),_rgba(0,255,165,1))] shadow-[0px_0px_7px_2px] shadow-primary sm:h-[400px]">
          <div className="flex flex-col justify-between p-10 sm:flex-row sm:items-center sm:px-10 sm:py-5 lg:px-24 lg:py-5">
            <div className="flex justify-center">
              <LottieFiles
                className="w-[60vw] sm:w-[15rem] lg:w-[20rem]"
                animation={track}
              />
            </div>
            <div className="text-secondary sm:flex sm:w-[55%] sm:flex-col sm:items-end">
              <div className="w-full">
                <Reveal>
                  <h1 className="m-2 my-3 text-center font-dosis text-[27px] font-bold text-secondary dark:text-white sm:text-end sm:text-4xl">
                    Let&#39;s
                    <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 pb-1 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
                      {text}
                      <span>
                        <Cursor cursorStyle="⨠" cursorBlinking={false}></Cursor>
                      </span>
                    </span>
                  </h1>
                </Reveal>
              </div>
              <Reveal>
                <p
                  style={{
                    filter: "drop-shadow(1px 1px 1px var(--secondary))",
                  }}
                  className="description my-5 font-edu text-secondary sm:text-end"
                >
                  Create and customize assignments seamlessly on our online study
                  platform. Enhance learning by providing engaging tasks that
                  students can complete for feedback.
                </p>
              </Reveal>
              <div className="flex w-[13rem] text-base lg:mt-5">
                <Link to={"/create"}>
                  <Button str="Create Now!" shadow={true}></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
