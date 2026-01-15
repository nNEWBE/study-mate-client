import "../../styles/style.css";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useAuth from "../../hooks/useAuth";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IoDocumentText, IoLogOut, IoMoon, IoSunny, IoHeart, IoGrid } from "react-icons/io5";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import Divider from "../ui/Divider";
import { useToggle } from "../../context/ToggleProvider";

interface DrawerProps {
  navRef: React.RefObject<HTMLElement>;
  drawer: boolean;
  setDrawer: (drawer: boolean) => void;
  handleNavLogout: () => void;
  handleTheme: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Drawer = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navRef,
  drawer,
  setDrawer,
  handleNavLogout,
  handleTheme,
}: DrawerProps) => {
  const { user } = useAuth();
  const { theme } = useToggle();

  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleOverlay = () => {
    setDrawer(false);
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  useGSAP(
    () => {
      const tl = gsap.timeline();

      if (drawer) {
        gsap.set(containerRef.current, { visibility: "visible" });

        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
          .to(
            sidebarRef.current,
            {
              x: 0,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.2"
          )
          .fromTo(
            ".drawer-item",
            { x: 30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: "back.out(1.2)",
            },
            "-=0.3"
          );
      } else {
        tl.to(sidebarRef.current, {
          x: "100%",
          duration: 0.4,
          ease: "power3.in",
        })
          .to(
            overlayRef.current,
            {
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
            },
            "-=0.2"
          )
          .set(containerRef.current, { visibility: "hidden" });
      }
    },
    { dependencies: [drawer], scope: containerRef }
  );

  const drawerLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: IoGrid,
    },
    {
      name: "Wishlist",
      path: "/wishlist",
      icon: IoHeart,
    },
    {
      name: "Submissions",
      path: "/dashboard/submissions",
      icon: IoDocumentText,
    },
    {
      name: "Logout",
      action: handleNavLogout,
      icon: IoLogOut,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 block overflow-hidden invisible"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlay}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0"
      />

      <nav>
        <div
          ref={sidebarRef}
          className="sidebar px-5 py-5 h-screen overflow-y-auto overflow-x-hidden will-change-transform !transition-none absolute right-0 translate-x-[100%]"
        >
          <div className="drawer-header flex items-center justify-between">
            <Logo onClick={handleDrawer} />
            <div
              onClick={handleDrawer}
              className="relative float-end block w-14 cursor-pointer"
            >
              <img
                className="size-[55px] rounded-full border-2 border-secondary object-cover shadow-[0_0_5px_2px] shadow-primary"
                referrerPolicy="no-referrer"
                src={user?.photoURL || undefined}
                alt="User"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-secondary bg-[#00ffa5] dark:border-secondary"></span>
              <span className="absolute bottom-0 right-0 h-4 w-4 animate-ping rounded-full bg-[#00ffa5]"></span>
            </div>
          </div>

          <div className="drawer-body mt-3 flex flex-col items-center justify-center sm:mt-10 lg:mt-3">
            <div className="mb-4 block sm:hidden lg:block">
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

            {/* User Name - Boxed Design */}
            <div className="mt-2 px-6 py-2 rounded-xl border-2 border-secondary bg-white shadow-[0_0_5px_2px] shadow-primary transform transition-transform duration-300">
              <h3 className="font-dosis text-2xl font-bold text-secondary text-center uppercase tracking-wide">
                {user?.displayName ? user.displayName : "Name not found"}
              </h3>
            </div>
            <p className="mt-3 rounded-xl border-2 border-secondary bg-white px-3 py-1 text-center font-edu text-base font-bold shadow-[0_0_5px_2px] shadow-primary">
              {user?.email ? user.email : "Email not found"}
            </p>

            {/* Divider */}
            <Divider orbSize="md" />

            <div className="space-y-3 w-full">
              {drawerLinks.map((item, index) => (
                <div key={index} className="drawer-item">
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={handleDrawer}
                      className="flex items-center gap-3"
                    >
                      <div>
                        <item.icon className="rounded-xl border-2 border-secondary bg-white p-[5px] text-[2.3rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
                      </div>
                      <Button str={item.name} shadow={true} width="w-fit"></Button>
                    </Link>
                  ) : (
                    <div
                      onClick={() => {
                        handleDrawer();
                        if (item.action) item.action();
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div>
                        <item.icon className="rounded-xl border-2 border-secondary bg-white p-[5px] text-[2.3rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
                      </div>
                      <Button str={item.name} shadow={true} width="w-fit"></Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
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
