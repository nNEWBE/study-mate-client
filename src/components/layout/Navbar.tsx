import { useEffect, useRef, useState } from "react";
import { IoDocumentText, IoMoon, IoSunny, IoHeart, IoGrid } from "react-icons/io5";
import { Link as Route, useNavigate, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap, { Power2 } from "gsap";
import Headroom from "react-headroom";
import { IoLogOut } from "react-icons/io5";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import Drawer from "./Drawer";
import useAuth from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/store";
import { useToggle } from "../../context/ToggleProvider";
import { NavLink } from "react-router-dom";
import { useModal } from "../ui/Modal";
import Divider from "../ui/Divider";

const navItems = [
  { id: 1, name: "Home", to: "/" },
  { id: 2, name: "Assignments", to: "/tasks" },
  { id: 3, name: "Create", to: "/create" },
  { id: 4, name: "Contact", to: "/contact" },
  { id: 5, name: "About", to: "/about" },
];

const Navbar = () => {
  const { logoutUser, loading } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const { theme, setTheme, setOverflow } = useToggle();
  const { showModal } = useModal();
  const [nav, setNav] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [visible, setVisible] = useState(true);
  const [slideStyle, setSlideStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);

  const handleDropdown = () => setDropdown(!dropdown);
  const handleDrawer = () => setDrawer(!drawer);
  const handleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked);
  };

  const bar = useRef<any>(null);
  const t1 = useRef<any>(null);

  // Dynamic slide indicator calculation
  useEffect(() => {
    const updateSlidePosition = () => {
      if (!navListRef.current) return;

      const activeLink = navListRef.current.querySelector('a.active') as HTMLElement;
      if (activeLink) {
        const navListRect = navListRef.current.getBoundingClientRect();
        const activeRect = activeLink.getBoundingClientRect();

        setSlideStyle({
          left: activeRect.left - navListRect.left,
          width: activeRect.width,
          opacity: 1,
        });
      } else {
        setSlideStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    // Small delay to ensure DOM is ready after route change
    const timeoutId = setTimeout(updateSlidePosition, 50);

    // Also update on window resize
    window.addEventListener('resize', updateSlidePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateSlidePosition);
    };
  }, [location.pathname, user]);

  // Reset nav state when user changes (login/logout)
  useEffect(() => {
    // Close mobile nav when user state changes
    if (nav) {
      setNav(false);
    }
    // Reset GSAP elements to initial state
    gsap.set(".container", { display: "none" });
    gsap.set(".nav-bg span", { x: "100%" });
    gsap.set(".nav-container li > *", { y: "100%" });
    // Reset hamburger icon to original state (3 horizontal bars)
    gsap.set(".bar-1", { attr: { d: "M10,2 L2,2" }, x: 0 });
    gsap.set(".bar-2", { autoAlpha: 1 });
    gsap.set(".bar-3", { attr: { d: "M10,8 L2,8" }, x: 0 });
  }, [user]);

  /* Removed unused GSAP stagger logic */

  /* Refactor to use useGSAP for correct cleanup and re-initialization when user changes */
  useGSAP(
    () => {
      bar.current = gsap.timeline({ paused: true });
      t1.current = gsap.timeline({ paused: true });

      bar.current
        .to(
          ".bar-1",
          {
            attr: { d: "M8,2 L2,8" },
            x: 1,
            ease: Power2.easeInOut,
          },
          "start"
        )
        .to(
          ".bar-2",
          {
            autoAlpha: 0,
          },
          "start"
        )
        .to(
          ".bar-3",
          {
            attr: { d: "M8,8 L2,2" },
            x: 1,
            ease: Power2.easeInOut,
          },
          "start"
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
        .to(
          ".nav-container li > *",
          {
            y: "0%",
            stagger: 0.1,
            ease: "Expo.easeInOut",
          },
          "-=0.5"
        )
        .reverse();
    },
    { dependencies: [user, loading], scope: ref, revertOnUpdate: true }
  );

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
    showModal({
      type: "confirm",
      title: "Want to Logout?",
      message: "You will be signed out of your account.",
      confirmText: "Yes, Logout",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: () => {
        setDropdown(false);
        if (drawer) handleDrawer();
        logoutUser();
        navigate("/");
        // Show success modal after logout
        setTimeout(() => {
          showModal({
            type: "success",
            title: "Logout Successful",
            message: "You have been signed out successfully.",
            confirmText: "OK",
          });
        }, 100);
      },
    });
  };

  const iconClasses = "rounded-xl border-2 border-secondary bg-white p-[5px] text-[2.3rem] text-secondary shadow-[0_0_5px_2px] shadow-primary group-hover:bg-primary group-hover:scale-110 transition-all duration-300";

  const dropdownMenuItems = [
    { label: "Dashboard", path: "/dashboard", Icon: IoGrid },
    { label: "Wishlist", path: "/wishlist", Icon: IoHeart },
    { label: "Submissions", path: "/dashboard/submissions", Icon: IoDocumentText },
    { label: "Logout", action: handleNavLogout, Icon: IoLogOut, isLogout: true },
  ];

  return (
    <div
      ref={ref}
      className="relative z-[51] h-[105px] bg-white dark:bg-secondary"
    >
      <Headroom pin={visible}>
        <div className="mx-auto flex  items-center justify-between overflow-hidden border-b-2 border-x-0 border-t-0 border-b-secondary bg-transparent px-5 py-5 shadow-[0_5px_10px_-2px] shadow-primary backdrop-blur-3xl lg:px-8">
          {loading ? (
            <SkeletonTheme
              baseColor={theme ? "#1e293b" : "#e5e7eb"}
              highlightColor={theme ? "#334155" : "#f3f4f6"}
            >
              <div className="w-[190px] h-[40px]">
                <Skeleton width={190} height={40} borderRadius="0.75rem" />
              </div>
            </SkeletonTheme>
          ) : (
            <Logo
              className="navs flex w-[190px] cursor-pointer items-center rounded-xl border-2 border-secondary bg-white font-dosis text-2xl font-medium text-secondary shadow-[0_0_5px_2px] shadow-primary"
            />
          )}

          <div className="relative flex items-center gap-7">
            <ul ref={navListRef} className="hidden items-center font-edu font-medium lg:flex relative">
              {/* Desktop Nav Items with Reveal Animation */}
              {loading ? (
                <SkeletonTheme
                  baseColor={theme ? "#1e293b" : "#e5e7eb"}
                  highlightColor={theme ? "#334155" : "#f3f4f6"}
                >
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="relative z-10 mr-4">
                      <Skeleton width={80} height={40} borderRadius="0.75rem" />
                    </div>
                  ))}
                </SkeletonTheme>
              ) : user
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
              <span
                className="slide"
                style={{
                  left: `${slideStyle.left}px`,
                  width: `${slideStyle.width}px`,
                  opacity: slideStyle.opacity,
                  transition: 'all 0.6s cubic-bezier(0.5, 0.01, 0.068, 0.99)',
                }}
              />
            </ul>
            <div className="hidden items-center gap-2 lg:flex">
              {loading ? (
                <SkeletonTheme
                  baseColor={theme ? "#1e293b" : "#e5e7eb"}
                  highlightColor={theme ? "#334155" : "#f3f4f6"}
                >
                  <div className="mr-5">
                    <Skeleton width={50} height={26} borderRadius={20} />
                  </div>
                </SkeletonTheme>
              ) : (
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
              )}
              {loading ? (
                <SkeletonTheme
                  baseColor={theme ? "#1e293b" : "#e5e7eb"}
                  highlightColor={theme ? "#334155" : "#f3f4f6"}
                >
                  <div className="relative w-14">
                    <Skeleton circle width={55} height={55} />
                  </div>
                </SkeletonTheme>
              ) : user ? (
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

          {loading ? (
            <SkeletonTheme
              baseColor={theme ? "#1e293b" : "#e5e7eb"}
              highlightColor={theme ? "#334155" : "#f3f4f6"}
            >
              <div className="flex items-center gap-3 lg:hidden">
                <Skeleton width={50} height={30} borderRadius={20} />
                <Skeleton circle width={45} height={45} />
              </div>
            </SkeletonTheme>
          ) : user ? (
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
          className={`user-dropdown fixed right-5 top-[7.8rem] hidden w-[320px] overflow-hidden rounded-xl border-secondary shadow-primary backdrop-blur-xl backdrop-filter lg:block ${dropdown ? 'dropdown-open' : 'dropdown-closed'}`}
        >
          <div className="flex flex-col items-center justify-center gap-2 p-5">
            {/* User Avatar with pop animation */}
            <div className="dropdown-avatar relative w-14 cursor-pointer transition-transform duration-300 hover:scale-110">
              <img
                className="rounded-full border-2 border-secondary shadow-[0_0_5px_2px] shadow-primary"
                referrerPolicy="no-referrer"
                src={user?.photoURL || undefined}
                alt="User"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-secondary bg-[#00ffa5]"></span>
              <span className="absolute bottom-0 right-0 h-4 w-4 animate-ping rounded-full bg-[#00ffa5]"></span>
            </div>

            {/* User Name - Boxed Design */}
            <div className="mt-2 px-6 py-2 rounded-xl border-2 border-secondary bg-white shadow-[0_0_5px_2px] shadow-primary transform transition-transform duration-300">
              <h3 className="font-dosis text-xl font-bold text-secondary text-center uppercase tracking-wide">
                {user?.displayName ? user.displayName : "Name not found"}
              </h3>
            </div>

            {/* Email */}
            <p className="mt-3 rounded-xl border-2 border-secondary bg-white px-3 py-1 font-edu text-base font-bold shadow-[0_0_5px_2px] shadow-primary">
              {user?.email ? user.email : "Email not found"}
            </p>

            {/* Divider */}
            <Divider orbSize="md" />

            {/* Menu Items with animations */}
            <div className="space-y-3 w-full">
              {dropdownMenuItems.map((item, index) => {
                const { label, path, Icon, action, isLogout } = item;

                if (isLogout) {
                  return (
                    <div
                      key={index}
                      onClick={action}
                      className="dropdown-menu-item flex items-center gap-3 group cursor-pointer transition-transform duration-200 hover:translate-x-1"
                    >
                      <div>
                        <Icon className={iconClasses} />
                      </div>
                      <Button str={label} shadow={true} width="w-fit" />
                    </div>
                  );
                }

                return (
                  <Route
                    key={index}
                    to={path!}
                    onClick={handleDropdown}
                    className="dropdown-menu-item flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1"
                  >
                    <div>
                      <Icon className={iconClasses} />
                    </div>
                    <Button str={label} shadow={true} width="w-fit" />
                  </Route>
                );
              })}
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
