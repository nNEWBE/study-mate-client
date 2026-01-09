import login from "../../public/Login.json";
import register from "../../public/Register.json";
import "boxicons";
import { useRef } from "react";
import "animate.css";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Bg from "../svg/Bg";
import LottieFiles from "../components/ui/LottieFiles";
import { motion } from "framer-motion";

const Account = () => {
  const loginRef = useRef<HTMLAnchorElement>(null);
  const registerRef = useRef<HTMLAnchorElement>(null);
  const loginLogoRef = useRef<HTMLDivElement>(null);
  const registerLogoRef = useRef<HTMLDivElement>(null);
  const loginFormRef = useRef<HTMLFormElement>(null);
  const registerFormRef = useRef<HTMLFormElement>(null);

  const handleButton1 = () => {
    registerRef.current?.classList.remove("bg-primary", "active");
    registerRef.current?.classList.add("bg-white");

    loginRef.current?.classList.remove("bg-white");
    loginRef.current?.classList.add("bg-primary", "active");

    registerLogoRef.current?.classList.remove("lg:flex");
    registerLogoRef.current?.classList.add("translate-x-[-100%]");
    loginLogoRef.current?.classList.remove("translate-x-[-100%]");
    loginLogoRef.current?.classList.add(
      "lg:flex",
      "animate__animated",
      "animate__fadeInLeft",
    );

    loginFormRef.current?.classList.remove("hidden", "translate-x-[100%]");
    registerFormRef.current?.classList.add("hidden", "translate-x-[100%]");
    loginFormRef.current?.classList.add(
      "animate__animated",
      "animate__fadeInRight",
    );
  };

  const handleButton2 = () => {
    loginRef.current?.classList.remove("bg-primary", "active");
    loginRef.current?.classList.add("bg-white");

    registerRef.current?.classList.remove("bg-white");
    registerRef.current?.classList.add("bg-primary", "active");

    loginLogoRef.current?.classList.remove("lg:flex");
    loginLogoRef.current?.classList.add("translate-x-[-100%]");
    registerLogoRef.current?.classList.remove("translate-x-[-100%]");
    registerLogoRef.current?.classList.add(
      "lg:flex",
      "animate__animated",
      "animate__fadeInLeft",
    );

    registerFormRef.current?.classList.remove("hidden", "translate-x-[100%]");
    loginFormRef.current?.classList.add("hidden", "translate-x-[100%]");
    registerFormRef.current?.classList.add(
      "animate__animated",
      "animate__fadeInRight",
    );
  };

  return (
    <motion.div
      initial={{ translateX: "100%" }}
      animate={{
        translateX: "0%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white py-10"
    >
      <div className="absolute inset-0">
        <Bg></Bg>
      </div>
      <div className="flex h-[580px] w-[90%] items-center justify-center rounded-xl sm:h-[650px] sm:w-3/4">
        <div className="flex size-full overflow-hidden rounded-3xl border-2 border-primary bg-primary bg-opacity-10 shadow-2xl backdrop-blur-[20px] backdrop-filter dark:border-white dark:border-opacity-[0.3] dark:bg-transparent sm:size-[90%]">
          <div
            ref={loginLogoRef}
            className="animate__animated animate__fadeInLeft col-1 hidden h-full w-1/2 flex-col items-center justify-center rounded-[22.5px_30%_20%_22.5px] border-2 border-primary bg-primary bg-opacity-10 shadow-xl dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] lg:flex"
          >
            <LottieFiles animation={login} className="w-[120%]" />
          </div>

          <div
            ref={registerLogoRef}
            className="col-1 hidden h-full w-1/2 translate-x-[-100%] flex-col items-center justify-center rounded-[22.5px_30%_20%_22.5px] border-2 border-primary bg-primary bg-opacity-10 shadow-xl dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]"
          >
            <LottieFiles animation={register} className="full" />
          </div>

          <div className="col-2 w-full text-secondary lg:w-1/2">
            <div className="relative mx-auto mb-5 mt-10 flex w-[15rem] justify-center gap-5">
              <a
                ref={loginRef}
                onClick={handleButton1}
                className="cursor-pointer rounded-xl border-2 border-secondary bg-primary px-3 pb-[3px] font-edu font-bold shadow-[0_0_5px_2px] shadow-primary transition-colors duration-[800]"
              >
                Sign In
              </a>

              <a
                ref={registerRef}
                onClick={handleButton2}
                className="cursor-pointer rounded-xl border-2 border-secondary bg-white px-3 pb-[3px] font-edu font-bold shadow-[0_0_5px_2px] shadow-primary transition-colors duration-[800]"
              >
                Sign Up
              </a>
              <button className="side"></button>
            </div>

            <div className="flex items-center justify-center">
              <Login loginFormRef={loginFormRef}></Login>
              <Register registerFormRef={registerFormRef}></Register>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Account;
