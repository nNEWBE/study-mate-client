import animation from "../../public/Assignment.json";
import "../styles/style.css";
import Reveal from "../animation/Reveal";
import Button from "../animation/Button";
import { Link } from "react-scroll";
import Wave from "../svg/Wave";
import LottieFiles from "../animation/LottieFiles";

const Banner = () => {
  return (
    <div
      id="Home"
      className="flex min-h-[calc(100vh-105px)] items-start bg-white dark:bg-secondary"
    >
      {/* style=
      {{
        background: `url(${wave})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100vw",
      }} */}

      <div className="mx-auto w-[90%] items-center justify-between sm:h-[calc(100vh-250px)] md:flex lg:h-full">
        <div>
          <Reveal>
            <h1 className="title font-dosis text-secondary dark:text-white">
              Welcome To<span className="text-primary">.</span>
            </h1>
          </Reveal>

          <Reveal>
            <div className="md:w-full">
              <p className="description mb-2 font-edu text-secondary dark:text-white">
                Empower your academic goals with our platform, where you can
                collaborate with peers, explore new topics, and enhance your
                critical thinking skills.
              </p>
            </div>
          </Reveal>

          <div className="mt-5 w-[13rem]">
            <Link
              to={"Features"}
              spy={true}
              smooth={true}
              offset={0}
              duration={500}
            >
              <Button str={"Get Started"} shadow={true}></Button>
            </Link>
          </div>
        </div>
        <div className="relative top-0 mt-4 flex items-center justify-center sm:top-5 sm:mt-0 md:w-full md:justify-end">
          <LottieFiles
            animation={animation}
            className="w-[280px] lg:w-[400px]"
          />
        </div>
      </div>
      <div className="absolute bottom-0 z-10 w-full">
        <Wave></Wave>
      </div>
    </div>
  );
};

export default Banner;
