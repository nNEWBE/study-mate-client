import { useEffect, useRef, useState } from "react";
import { Icons } from "../svg/Icons";
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";

const NavMenu = () => {
  const [activeLink, setActiveLink] = useState("Hero");
  const [cross, setCross] = useState(true);
  const cancelRef = useRef();
  const hiddenRef = useRef();
  const hiddenRe2 = useRef();
  const moveRef = useRef();
  const handleCancel = () => {
    setCross(!cross);
    hiddenRef.current.classList.toggle("hidden");
    hiddenRef.current.classList.toggle("flex");

    if (cancelRef.current.classList.contains("w-[50px]")) {
      setTimeout(() => {
        hiddenRe2.current.classList.toggle("hidden");
      }, 200);
    } else hiddenRe2.current.classList.toggle("hidden");

    cancelRef.current.classList.toggle("w-[40px]");
    cancelRef.current.classList.toggle("w-[20rem]");
    cancelRef.current.classList.toggle("h-20");
    cancelRef.current.classList.toggle("h-[40px]");
    cancelRef.current.classList.toggle("sm:w-[30rem]");
    cancelRef.current.classList.toggle("right-10");
    cancelRef.current.classList.toggle("shadow-[0px_0px_10px_3px]");
    cancelRef.current.classList.toggle("shadow-primary");

    moveRef.current.classList.toggle("-right-[43%]");
    moveRef.current.classList.toggle("sm:-right-[44%]");
    moveRef.current.classList.toggle("right-1");
    moveRef.current.classList.toggle("sm:right-1");
    moveRef.current.classList.toggle("rotate-180");
    moveRef.current.classList.toggle("rotate-0");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element.id === "Home") {
      const scrollToY =
        element.getBoundingClientRect().top + window.scrollY - 105;
      window.scrollTo({ top: scrollToY, behavior: "smooth" });
    } else {
      const scrollToY =
        element.getBoundingClientRect().top + window.scrollY - 0;
      window.scrollTo({ top: scrollToY, behavior: "smooth" });
    }
  };

  const determineActiveSection = () => {
    for (let i = Icons.length - 1; i >= 0; i--) {
      const section = document.getElementById(Icons[i].to);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 420 && rect.bottom >= 420) {
          setActiveLink(Icons[i].to);
          break;
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      determineActiveSection();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`flex w-full justify-center`}>
      <div
        ref={cancelRef}
        className="fixed bottom-14 right-10 z-[11] h-[40px] w-[40px] rounded-3xl border-2 border-secondary bg-white transition-all duration-300 dark:bg-secondary"
      >
        <div
          ref={hiddenRef}
          className="navmenu-item-container mx-3 hidden h-full items-center justify-center"
        >
          {Icons.map((section, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: section.svg }}
              className={`${activeLink === section.to ? "nav" : ""} navigation-menu mx-2 cursor-pointer rounded-full border-2 border-secondary p-1 dark:border-white sm:mx-5`}
              onClick={() => scrollToSection(section.to)}
            />
          ))}
          <div className="nav-slide" />
        </div>
        <div
          ref={moveRef}
          onClick={handleCancel}
          className="navmenu relative bottom-[1px] right-1 z-[12] flex h-[40px] w-[45px] rotate-180 cursor-pointer items-center justify-center rounded-xl border-2 border-secondary bg-white text-white shadow-[0px_0px_10px_3px] shadow-primary transition-all duration-500 dark:bg-secondary sm:right-1 sm:h-[50px] sm:w-[60px]"
        >
          {cross ? (
            <RxHamburgerMenu className="absolute text-3xl text-secondary dark:text-white sm:text-4xl" />
          ) : (
            <RxCross2 className="absolute text-3xl text-secondary dark:text-white sm:text-4xl" />
          )}
          <span ref={hiddenRe2} className="line hidden"></span>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
