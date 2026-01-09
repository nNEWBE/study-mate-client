import { useEffect, useRef, useState } from "react";
import { IoDocumentText, IoMoon, IoSunny } from "react-icons/io5";
import { Link as Route, useNavigate } from "react-router-dom";
import { gsap, Power2 } from "gsap";
import { useToggle } from "../../context/ToggleProvider";
import { IoLogOut } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import logo1 from "../../../public/Logo_01.json";
import logo2 from "../../../public/Logo_02.json";
import Headroom from "react-headroom";
import Button from "../ui/Button";
import Unhidden from "../../animation/Unhidden";

import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import Drawer from "./Drawer";
import LottieFiles from "../ui/LottieFiles";
import "../../styles/style.css";

gsap.registerPlugin();

const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, setTheme, setOverflow } = useToggle();
  const [visible, setVisible] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [nav, setNav] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user, logoutUser } = useAuth();

  const handleDrawer = () => {
    setDrawer(!drawer);
    navRef.current?.classList.toggle("open");
  };

  const handleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDark = e.target.checked;
    setTheme(isDark);
  };

  const handleDropdown = () => {
    setDropdown(!dropdown);

    if (!dropdownRef.current) return;

    dropdownRef.current.classList.toggle("h-0");
    dropdownRef.current.classList.toggle("h-[350px]");
    if (
      dropdownRef.current.classList.contains("shadow-[0_0_5px_2px]") &&
      dropdownRef.current.classList.contains("border-2")
    ) {
      setTimeout(() => {
        dropdownRef.current?.classList.toggle("border-2");
        dropdownRef.current?.classList.toggle("shadow-[0_0_5px_2px]");
      }, 400);
    } else {
      dropdownRef.current.classList.toggle("border-2");
      dropdownRef.current.classList.toggle("shadow-[0_0_5px_2px]");
    }
  };

  // window.addEventListener("scroll", () => {
  //   if (window.scrollY > 0) {
  //     const navs = document.getElementsByClassName("navs");

  //     Array.from(navs).forEach((element, index) => {
  //       if (!element.classList.contains("active")) {
  //         if (index == 0) {
  //           element.classList.add("active");
  //         }
  //       }else if(element.classList.contains("active")){
  //         if (index == 0) {
  //           element.classList.remove("active");
  //         }
  //       }
  //     });
  //   }
  // });

  const navItems = [
    { id: 1, name: "Home", to: "/" },
    { id: 2, name: "All Tasks", to: "/tasks" },
    { id: 3, name: "Create", to: "/create" },
    { id: 4, name: "Contact", to: "/contact" },
    { id: 5, name: "Blog", to: "/blog" },
  ];

  const bar = useRef(gsap.timeline({ paused: true }));
  const t1 = useRef(gsap.timeline({ paused: true }));
  /* Removed unused GSAP stagger logic */

  useEffect(() => {
    bar.current
      .to(
        ".bar-1",
        {
          attr: { d: "M8,2 L2,8" },
          x: 1,
          ease: Power2.easeInOut,
        },
        "start",
      )
      .to(
        ".bar-2",
        {
          autoAlpha: 0,
        },
        "start",
      )
      .to(
        ".bar-3",
        {
          attr: { d: "M8,8 L2,2" },
          x: 1,
          ease: Power2.easeInOut,
        },
        "start",
      )
      .reverse();

    gsap.from(".navs", {
      opacity: 0,
      y: -250,
      duration: 1,
      ease: Power2.easeOut,
      stagger: 0.1,
    });

    t1.current
      .to(".container", {
        display: "block",
        ease: "Expo.easeInOut",
      })
      .from(".nav-bg span", {
        x: "100%",
        stagger: 0.1,
        ease: "Expo.easeInOut",
      })
      .from(
        ".nav-container li a",
        {
          y: "100%",
          stagger: 0.1,
          ease: "Expo.easeInOut",
        },
        "-=0.5",
      )
      .reverse();
  }, []);

  const getNavOptions = () => {
    bar.current.reversed(!bar.current.reversed());
    t1.current.reversed(!t1.current.reversed());

    setNav(!nav);
  };

  const handleClick = () => {
    getNavOptions();
  };

  useEffect(() => {
    if (nav === true && dropdown === true) {
      document.body.classList.add("overflow-hidden");
      setOverflow(true);
      setVisible(true);
    } else if (nav === true && dropdown === false) {
      document.body.classList.add("overflow-hidden");
      setOverflow(true);
      setVisible(true);
    } else if (nav === false && dropdown === true) {
      document.body.classList.add("overflow-hidden");
      setOverflow(true);
      setVisible(true);
    } else if (nav === false && dropdown === false) {
      document.body.classList.remove("overflow-hidden");
      setOverflow(false);
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  }, [nav, dropdown, setOverflow]);

  useEffect(() => {
    if (nav === true && drawer === true) {
      document.body.classList.add("overflow-hidden");
      setOverflow(true);
      setVisible(true);
    } else if (nav === true && drawer === false) {
      document.body.classList.add("overflow-hidden");
      setOverflow(true);
      setVisible(true);
    } else if (nav === false && drawer === true) {
      document.body.classList.add("overflow-hidden");
      setOverflow(true);
      setVisible(true);
    } else if (nav === false && drawer === false) {
      document.body.classList.remove("overflow-hidden");
      setOverflow(false);
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  }, [nav, drawer, setOverflow]);

  const handleNavLogout = () => {
    Swal.fire({
      title: "Want to Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      iconColor: "#3085d6",
      confirmButtonText: "Yes, Logout",
      background: "#111827",
      buttonsStyling: false,
      color: "#FFFFFF",
      customClass: {
        confirmButton:
          "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#3085d6] hover:text-[#3085d6] border-[4.5px] border-[#3085d6] text-[#3085d6] text-2xl font-bold font-edu px-5",
        cancelButton:
          "btn ml-5 animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#ef4444] hover:text-[#ef4444] border-[4.5px] border-[#ef4444] text-[#ef4444] text-2xl font-bold font-edu px-5",
        title: "font-poppins",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setDropdown(false);
        drawer ? handleDrawer() : "";
        logoutUser();
        navigate("/");
        Swal.fire({
          title: "Logout Successful",
          icon: "success",
          confirmButtonText: "Save",
          iconColor: "#00ffa5",
          background: "#111827",
          buttonsStyling: false,
          color: "#FFFFFF",
          customClass: {
            confirmButton:
              "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#00ffa5] hover:text-[#00ffa5] border-[4.5px] border-[#00ffa5] text-[#00ffa5] text-2xl font-bold font-edu px-5",
            title: "font-poppins",
          },
        });
      }
    });
  };

  return (
    <div
      ref={ref}
      className="relative z-[51] h-[105px] bg-white dark:bg-secondary"
    >
      <Headroom pin={visible}>
        <div className="mx-auto flex  items-center justify-between overflow-hidden border-2 border-x-0 border-t-0 border-b-secondary bg-transparent px-5 py-5 shadow-[0_0_5px_2px] shadow-primary backdrop-blur-3xl lg:px-8">
          <Route
            to="/"
            className="navs flex w-[190px] cursor-pointer items-center rounded-xl border-2 border-secondary bg-white font-dosis text-2xl font-medium text-secondary shadow-[0_0_5px_2px] shadow-primary"
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
          </Route>

          <div className="relative flex items-center gap-7">
            <ul className="hidden items-center font-edu font-medium lg:flex relative">
              {/* Desktop Nav Items with Reveal Animation */}
              {user
                ? navItems.map((item) => (
                  <NavLink
                    to={item.to}
                    key={item.id}
                    className={({ isActive }) =>
                      `navs relative z-10 mr-4 cursor-pointer rounded-xl border-2 border-secondary bg-white px-3 font-bold text-secondary shadow-[0_0_5px_2px] shadow-primary ${isActive ? "active" : ""}`
                    }
                  >
                    <span>{item.name}</span>
                  </NavLink>
                ))
                : navItems
                  .filter((item) => item.name !== "Create")
                  .map((item) => (
                    <NavLink
                      to={item.to}
                      key={item.id}
                      className={({ isActive }) =>
                        `navs relative z-10 mr-4 cursor-pointer rounded-xl border-2 border-secondary bg-white px-3 font-bold text-secondary shadow-[0_0_5px_2px] shadow-primary ${isActive ? "active" : ""}`
                      }
                    >
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
              <a className="slide"></a>
            </ul>
            <div className="hidden items-center gap-2 lg:flex">
              <div className="navs relative bottom-3 right-2">
                <input
                  onChange={handleTheme}
                  checked={theme === null ? false : theme}
                  type="checkbox"
                  id="darkmode-toggle-1"
                  className="toggle-input"
                />
                <label htmlFor="darkmode-toggle-1" className="toggle-label">
                  <IoSunny className="sun" />
                  <IoMoon className="moon" />
                </label>
              </div>
              {user ? (
                <div
                  onClick={handleDropdown}
                  className="navs relative w-14 cursor-pointer"
                >
                  <img
                    className="size-[55px] rounded-full border-2 border-secondary object-cover shadow-[0_0_5px_2px] shadow-primary"
                    referrerPolicy="no-referrer"
                    src={user?.photoURL || undefined}
                    alt="User"
                  />
                  <span className="dark:border-scondary absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-secondary bg-[#00ffa5]"></span>
                  <span className="absolute bottom-0 right-0 h-4 w-4 animate-ping rounded-full bg-[#00ffa5]"></span>
                </div>
              ) : (
                <Route to="/account" className="navs">
                  <Button str={"Sign Up"} shadow={true}></Button>
                </Route>
              )}
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3 lg:hidden">
              <div className="relative bottom-3 right-0 hidden sm:block lg:hidden">
                <input
                  checked={theme === null ? false : theme}
                  onChange={handleTheme}
                  type="checkbox"
                  id="darkmode-toggle-3"
                  className="toggle-input"
                />
                <label htmlFor="darkmode-toggle-3" className="toggle-label">
                  <IoSunny className="sun" />
                  <IoMoon className="moon" />
                </label>
              </div>
              <div className="rounded-full">
                <button
                  onClick={handleClick}
                  className="toggle-btn cursor-pointer rounded-[200px] border-2 border-secondary bg-white p-2 shadow-[0_0_5px_2px] shadow-primary outline-none"
                  id="nav-toggle-btn"
                >
                  <svg
                    viewBox="0 0 12 10"
                    className="hamburger"
                    width="25px"
                    height="25px"
                  >
                    <path d="M10,2 L2,2" className="bar-1"></path>
                    <path d="M2,5 L10,5" className="bar-2"></path>
                    <path d="M10,8 L2,8" className="bar-3"></path>
                  </svg>
                </button>
              </div>
              <div
                onClick={handleDrawer}
                className="relative block w-11 cursor-pointer"
              >
                <img
                  className="size-[45px] rounded-full border-2 border-secondary object-cover shadow-[0_0_5px_2px] shadow-primary"
                  referrerPolicy="no-referrer"
                  src={user?.photoURL || undefined}
                  alt="User"
                />
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-secondary bg-[#00ffa5] dark:border-secondary"></span>
                <span className="absolute bottom-0 right-0 h-4 w-4 animate-ping rounded-full bg-[#00ffa5]"></span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-5 lg:hidden">
              <div className="relative bottom-3 right-2">
                <input
                  checked={theme === null ? false : theme}
                  onChange={handleTheme}
                  type="checkbox"
                  id="darkmode-toggle-2"
                  className="toggle-input"
                />
                <label htmlFor="darkmode-toggle-2" className="toggle-label">
                  <IoSunny className="sun" />
                  <IoMoon className="moon" />
                </label>
              </div>
              <button
                onClick={handleClick}
                className="toggle-btn cursor-pointer rounded-[200px] border-2 border-secondary bg-white p-2 shadow-[0_0_5px_2px] shadow-primary outline-none"
                id="nav-toggle-btn"
              >
                <svg
                  viewBox="0 0 12 10"
                  className="hamburger"
                  width="25px"
                  height="25px"
                >
                  <path d="M10,2 L2,2" className="bar-1"></path>
                  <path d="M2,5 L10,5" className="bar-2"></path>
                  <path d="M10,8 L2,8" className="bar-3"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </Headroom>

      <Drawer
        navRef={navRef}
        drawer={drawer}
        setDrawer={setDrawer}
        handleNavLogout={handleNavLogout}
        handleTheme={handleTheme}
      ></Drawer>

      {user && (
        <div
          ref={dropdownRef}
          className="dropdown fixed right-5 top-[6.6rem] hidden h-0 w-[320px] overflow-hidden rounded-xl border-secondary shadow-primary backdrop-blur-xl backdrop-filter lg:block"
        >
          <div className="flex flex-col items-center justify-center gap-2 p-5">
            <div className="w-14 cursor-pointer">
              <img
                className="rounded-full border-2 border-secondary shadow-[0_0_5px_2px] shadow-primary"
                referrerPolicy="no-referrer"
                src={user?.photoURL || undefined}
                alt="User"
              />
            </div>
            <p
              style={{ textShadow: "1.5px 1px 3px #00ffa5" }}
              className="font-dosis text-2xl font-bold text-secondary"
            >
              {user?.displayName ? user.displayName : "Name not found"}
            </p>
            <p className="mt-3 rounded-xl border-2 border-secondary bg-white px-3 py-1 font-edu text-base font-bold shadow-[0_0_5px_2px] shadow-primary">
              {user?.email ? user.email : "Email not found"}
            </p>
            <div className="my-3 flex w-full items-center justify-center">
              <div className="w-full flex-grow border-2 border-t border-secondary shadow-[0_0_5px_2px] shadow-primary"></div>
              <span
                style={{ textShadow: "1.5px 1px 3px #00ffa5" }}
                className="w-full text-center font-dosis text-xl font-bold uppercase text-secondary"
              >
                Pages
              </span>
              <div className="w-full flex-grow border-2 border-t border-secondary shadow-[0_0_5px_2px] shadow-primary"></div>
            </div>{" "}
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
      )}

      <div className="absolute top-[6.6rem] block w-full overflow-hidden lg:hidden">
        <section className="container fixed hidden h-screen w-full">
          <div className="container-inner flex h-full items-start px-[37px] sm:items-center">
            <div className="nav-bg absolute -top-2 left-0 h-[calc(100vh-100px)] w-full">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="nav relative top-10 sm:-top-20">
              <ul className="nav-container">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.to}
                      key={item.id}
                      onClick={handleClick}
                      className="inline-block cursor-pointer font-edu text-xl font-bold text-secondary"
                    >
                      <Button str={item.name} shadow={false}></Button>
                    </NavLink>
                  </li>
                ))}
                {user ? (
                  <li>
                    <div className="inline-block text-xl cursor-pointer" onClick={handleNavLogout}>
                      <Button str={"Logout"} shadow={false}></Button>
                    </div>
                  </li>
                ) : (
                  <li>
                    <Route
                      onClick={handleClick}
                      to="/account"
                      className="inline-block text-xl"
                    >
                      <Button str={"Sign Up"} shadow={false}></Button>
                    </Route>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Navbar;
