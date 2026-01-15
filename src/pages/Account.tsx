import login from "../../public/Login.json";
import register from "../../public/Register.json";
import "boxicons";
import { useRef, useState, useEffect } from "react";
import "animate.css";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import LottieFiles from "../components/ui/LottieFiles";
import { motion } from "framer-motion";

const Account = () => {
  const loginRef = useRef<HTMLAnchorElement>(null);
  const registerRef = useRef<HTMLAnchorElement>(null);
  const loginLogoRef = useRef<HTMLDivElement>(null);
  const registerLogoRef = useRef<HTMLDivElement>(null);
  const loginFormRef = useRef<HTMLFormElement>(null);
  const registerFormRef = useRef<HTMLFormElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [sideStyle, setSideStyle] = useState({ left: 0, width: 0, opacity: 1 });

  // Dynamic side indicator calculation
  useEffect(() => {
    const updateSidePosition = () => {
      if (!tabContainerRef.current) return;

      const activeButton = activeTab === 'login' ? loginRef.current : registerRef.current;
      if (activeButton) {
        const containerRect = tabContainerRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        setSideStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
          opacity: 1,
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateSidePosition, 50);
    window.addEventListener('resize', updateSidePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateSidePosition);
    };
  }, [activeTab]);

  const handleButton1 = () => {
    setActiveTab('login');

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
    setActiveTab('register');

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
      className="relative flex items-center justify-center overflow-hidden bg-white dark:bg-secondary py-10"
    >
      {/* Background glow effects - clean & simple like About/Contact pages */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl dark:bg-primary/8" />
      <div className="flex mx-auto w-[90%] max-w-7xl h-[580px] items-center justify-center rounded-xl sm:h-[650px] sm:w-3/4">
        <div className="flex size-full overflow-hidden rounded-3xl border-2 border-primary bg-primary bg-opacity-10 backdrop-blur-[20px] backdrop-filter dark:border-white dark:border-opacity-[0.3] dark:bg-transparent sm:size-[90%]">
          <div
            ref={loginLogoRef}
            className="animate__animated animate__fadeInLeft col-1 hidden h-full w-1/2 flex-col items-center justify-center rounded-[22.5px_30%_20%_22.5px] border-r-2 border-primary bg-primary bg-opacity-10 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] lg:flex"
          >
            <LottieFiles animation={login} className="w-full" />
          </div>

          <div
            ref={registerLogoRef}
            className="col-1 hidden h-full w-1/2 translate-x-[-100%] flex-col items-center justify-center rounded-[22.5px_30%_20%_22.5px] border-r-2 border-primary bg-primary bg-opacity-10 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]"
          >
            <LottieFiles animation={register} className="w-[83%] mx-auto" />
          </div>

          <div className="col-2 w-full text-secondary lg:w-1/2">
            <div ref={tabContainerRef} className="relative mx-auto mb-5 mt-10 flex w-[15rem] justify-center gap-5">
              <a
                ref={loginRef}
                onClick={handleButton1}
                className="cursor-pointer rounded-xl border-2 border-secondary bg-primary px-3 pb-[3px] font-edu font-bold shadow-[0_0_5px_2px] shadow-primary transition-colors duration-[800] active"
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
              <span
                className="side"
                style={{
                  left: `${sideStyle.left}px`,
                  width: `${sideStyle.width}px`,
                  opacity: sideStyle.opacity,
                  transition: 'all 0.4s cubic-bezier(0.5, 0.01, 0.068, 0.99)',
                }}
              />
            </div>

            <div className="mx-auto flex w-full max-w-[400px] items-center justify-center px-4">
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

