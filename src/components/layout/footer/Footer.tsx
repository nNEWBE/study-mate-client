import { Link } from "react-scroll";
import ItemsContainer from "./ItemsContainer";
import SocialIcons from "./SocialIcons";
import { Icons } from "./Menus";
import logo1 from "../../../../public/Logo_01.json";
import logo2 from "../../../../public/Logo_02.json";
import Button from "../../ui/Button";
import "../../../styles/style.css";
import "boxicons";
import Reveal from "../../../animation/Reveal";
import { useToggle } from "../../../context/ToggleProvider";
import LottieFiles from "../../ui/LottieFiles";

const Footer = () => {
  const { theme } = useToggle();
  return (
    <footer className="z-10 w-full bg-white text-white dark:bg-secondary" id="Contact">
      <div className="sticky top-0 z-10 flex flex-col items-center border-y-2 border-y-black px-9 py-5 shadow-[0_0_5px_2px] shadow-primary backdrop-blur-xl backdrop-filter sm:flex-row sm:justify-between">
        <Link
          activeClass="top"
          spy={true}
          smooth={true}
          offset={-105}
          duration={500}
          to={"Home"}
          className="flex w-[190px] cursor-pointer items-center rounded-xl border-2 border-black bg-white font-dosis text-2xl font-medium text-gray-900 shadow-[0_0_5px_2px] shadow-primary dark:bg-white"
        >
          <LottieFiles
            animation={logo1}
            className="w-16 rounded-xl border-[5px] border-white"
          />

          <p className="relative right-3">tudy</p>
          <LottieFiles
            animation={logo2}
            className="relative right-3 w-16 rounded-xl border-[5px] border-white"
          />
          <p className="relative right-6">ate</p>
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-[17rem] rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
            />

            <div className="absolute right-4 top-3">
              <box-icon
                name="user"
                color={`${theme ? "white" : "black"}`}
              ></box-icon>
            </div>
          </div>

          <Button str={"Subscribe"} shadow={true}></Button>
        </div>
      </div>
      <div className="max-w-[90rem] mx-auto">
        <ItemsContainer />
      </div>

      <div className="mb-10 flex flex-col items-center gap-5 md:hidden">
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="placeholder- w-[17rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />

          <div className="absolute right-4 top-3">
            <box-icon
              name="user"
              color={`${theme ? "white" : "black"}`}
            ></box-icon>
          </div>
        </div>
        <div className="w-[13rem]">
          <Button str={"Subscribe"} shadow={true}></Button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-center gap-8 pb-8 pt-2 text-center font-edu text-sm text-secondary dark:text-white lg:flex-row lg:justify-between lg:px-8">
        <div className="flex flex-col items-center gap-3 font-bold sm:flex-row sm:gap-8">
          <a className="flex justify-center text-center">
            <Reveal>
              <span>
                © 2024 Study Mate{" "}
                <span className="text-2xl font-bold text-primary"> . </span> All
                rights reserved.
              </span>
            </Reveal>
          </a>
          <a className="flex justify-center text-center">
            <Reveal>
              <span>
                Terms <span className="text-2xl font-bold text-primary"> . </span>{" "}
                Privacy Policy
              </span>
            </Reveal>
          </a>
        </div>
        <SocialIcons Icons={Icons} />
      </div>
    </footer>
  );
};

export default Footer;
