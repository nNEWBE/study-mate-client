import { useEffect, useRef, useState } from "react";
import { Icons } from "../../svg/Icons";
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";

const NavMenu = () => {
  const [activeLink, setActiveLink] = useState("Hero");
  const [cross, setCross] = useState(true);
  const cancelRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const hiddenRe2 = useRef<HTMLSpanElement>(null);
  const moveRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    const hiddenEl = hiddenRef.current;
    const cancelEl = cancelRef.current;
    const hiddenRe2El = hiddenRe2.current;
    const moveEl = moveRef.current;

    if (!hiddenEl || !cancelEl || !hiddenRe2El || !moveEl) return;

    setCross(!cross);
    hiddenEl.classList.toggle("hidden");
    hiddenEl.classList.toggle("flex");

    if (cancelEl.classList.contains("w-[50px]")) {
      setTimeout(() => {
        hiddenRe2El.classList.toggle("hidden");
      }, 200);
    } else hiddenRe2El.classList.toggle("hidden");

    cancelEl.classList.toggle("w-[40px]");
    cancelEl.classList.toggle("w-[20rem]");
    cancelEl.classList.toggle("h-20");
    cancelEl.classList.toggle("h-[40px]");
    cancelEl.classList.toggle("sm:w-[30rem]");
    cancelEl.classList.toggle("right-10");
    cancelEl.classList.toggle("shadow-[0px_0px_10px_3px]");
    cancelEl.classList.toggle("shadow-primary");

    moveEl.classList.toggle("-right-[43%]");
    moveEl.classList.toggle("sm:-right-[44%]");
    moveEl.classList.toggle("right-1");
    moveEl.classList.toggle("sm:right-1");
    moveEl.classList.toggle("rotate-180");
    moveEl.classList.toggle("rotate-0");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
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
