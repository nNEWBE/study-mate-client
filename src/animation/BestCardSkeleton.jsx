import { useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToggleContext } from "../context/ToggleProvider";

const BestCardSkeleton = ({ cards }) => {
  const { theme } = useContext(ToggleContext);
  return Array(cards)
    .fill(0)
    .map((card, index) => (
      <div
        key={index}
        className="sticky top-20 z-10 mx-auto pt-7 sm:top-72 sm:h-[17rem] lg:h-[20rem] lg:w-[60rem]"
      >
        <SkeletonTheme
          baseColor={theme ? "#212842" : "rgba(0, 255, 165, .3)"}
          highlightColor={theme ? "#42495e" : "rgba(0, 255, 165, .2)"}
        >
          <div className="flex flex-col gap-5 rounded-2xl border-[3px] border-primary border-opacity-45 bg-white p-5 dark:border-[#212842] dark:border-opacity-100 dark:bg-secondary sm:flex-row sm:items-center">
            <div className="h-[13.8rem] w-full sm:w-[60vw] md:w-[50vw] lg:h-[16.7rem] lg:w-[23vw]">
              <Skeleton borderRadius={"1rem"} width={"100%"} height={"100%"} />
            </div>
            <div className="sm:w-[140%] lg:w-[75%] lg:py-7">
              <div className="mb-5 h-[1.7rem] w-[75%] sm:h-[2rem] sm:w-[25vw]">
                <Skeleton
                  width={"100%"}
                  height={"100%"}
                  borderRadius={"10px"}
                />
              </div>
              <div>
                <Skeleton count={7} borderRadius={"5px"} />
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>
    ));
};

export default BestCardSkeleton;
