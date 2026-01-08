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
      className="relative flex min-h-[calc(100vh-105px)] items-center bg-white dark:bg-secondary lg:items-start 2xl:pt-24 lg:pt-8"
    >
      {/* style=
      {{
        background: `url(${wave})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100vw",
      }} */}

      <div className="mx-auto w-[90%] max-w-[90rem] items-center justify-between md:flex">
        <div className="md:w-1/2">
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
        <div className="mt-10 flex items-center justify-center md:mt-0 md:w-1/2 md:justify-end">
          <LottieFiles
            animation={animation}
            className="w-[280px] lg:w-[400px]"
          />
        </div>
      </div>
      <div className="absolute bottom-0 z-10 w-full">
        <Reveal width="100%" overlay={false}>
          <Wave></Wave>
        </Reveal>
      </div>
    </div>
  );
};

export default Banner;
