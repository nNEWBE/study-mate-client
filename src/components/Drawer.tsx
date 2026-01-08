import "../styles/style.css";
import useAuth from "../hooks/useAuth";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import logo1 from "../../public/Logo_01.json";
import logo2 from "../../public/Logo_02.json";
import { IoDocumentText, IoLogOut, IoMoon, IoSunny } from "react-icons/io5";
import Button from "../animation/Button";
import { useContext } from "react";
import { ToggleContext } from "../context/ToggleProvider";

const Drawer = ({
  navRef,
  drawer,
  setDrawer,
  handleNavLogout,
  handleTheme,
}) => {
  const { user } = useAuth();
  const { theme } = useContext(ToggleContext);

  const handleOverlay = () => {
    setDrawer(!drawer);
    navRef.current.classList.remove("open");
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
    navRef.current.classList.toggle("open");
  };

  return (
    <div className="block">
      <nav ref={navRef}>
        <div className="sidebar px-5 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={handleDrawer}
              className="flex w-[190px] cursor-pointer items-center rounded-xl border-2 border-secondary bg-white font-dosis text-2xl font-medium shadow-[0_0_5px_2px] shadow-primary"
            >
              <Lottie
                animationData={logo1}
                loop={true}
                className="w-16 rounded-xl border-[5px] border-white"
              />
              <p className="relative right-3">tudy</p>
              <Lottie
                animationData={logo2}
                loop={true}
                className="relative right-3 w-16 rounded-xl border-[5px] border-white"
              />
              <p className="relative right-6">ate</p>
            </Link>
            <div
              onClick={handleDrawer}
              className="relative float-end block w-11 cursor-pointer"
            >
              <img
                className="size-[45px] rounded-full border-2 border-secondary object-cover shadow-[0_0_5px_2px] shadow-primary"
                referrerPolicy="no-referrer"
                src={user?.photoURL}
                alt="User"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-secondary bg-[#00ffa5] dark:border-secondary"></span>
              <span className="absolute bottom-0 right-0 h-4 w-4 animate-ping rounded-full bg-[#00ffa5]"></span>
            </div>
          </div>
          <div className="mt-3 flex flex-col items-center justify-center sm:mt-10 lg:mt-3">
            <div className="relative bottom-3 right-2 block sm:hidden lg:block">
              <input
                checked={theme === null ? false : theme}
                onChange={handleTheme}
                type="checkbox"
                id="darkmode-toggle-4"
                className="toggle-input"
              />
              <label htmlFor="darkmode-toggle-4" className="toggle-label">
                <IoSunny className="sun" />
                <IoMoon className="moon" />
              </label>
            </div>
            <p
              style={{ textShadow: "1.5px 1px 3px #00ffa5" }}
              className="text-center font-dosis text-2xl font-bold text-secondary"
            >
              {user?.displayName ? user.displayName : "Name not found"}
            </p>
            <p className="mt-3 rounded-xl border-2 border-secondary bg-white px-3 py-1 text-center font-edu text-base font-bold shadow-[0_0_5px_2px] shadow-primary">
              {user?.email ? user.email : "Email not found"}
            </p>

            <div className="my-10 flex w-full items-center justify-center">
              <div className="w-full flex-grow border-2 border-t border-secondary shadow-[0_0_5px_2px] shadow-primary"></div>
              <span
                style={{ textShadow: "1.5px 1px 3px #00ffa5" }}
                className="w-full text-center font-dosis text-xl font-bold uppercase text-secondary"
              >
                Pages
              </span>
              <div className="w-full flex-grow border-2 border-t border-secondary shadow-[0_0_5px_2px] shadow-primary"></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div>
                  <IoDocumentText className="rounded-xl border-2 border-secondary bg-white p-[5px] text-[2.3rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
                </div>
                <Button str="Submissions" shadow={true}></Button>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <IoLogOut className="rounded-xl border-2 border-secondary bg-white p-[5px] text-[2.3rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
                </div>
                <div onClick={handleNavLogout}>
                  <Button str={"Logout"} shadow={true}></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <section onClick={handleOverlay} className="overlay"></section>
    </div>
  );
};

export default Drawer;

Drawer.propTypes = {
  navRef: PropTypes.object,
  drawer: PropTypes.bool,
  setDrawer: PropTypes.func,
  handleNavLogout: PropTypes.func,
  handleTheme: PropTypes.func,
};
