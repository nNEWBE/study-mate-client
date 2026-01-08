import { useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToggleContext } from "../context/ToggleProvider";

interface CardSkeletonProps {
  cards: number;
}

const CardSkeleton = ({ cards }: CardSkeletonProps): JSX.Element => {
  const context = useContext(ToggleContext);
  const theme = context?.theme;

  return (
    <>
      {Array(cards)
        .fill(0)
        .map((_, index) => (
          <SkeletonTheme
            key={index}
            baseColor={theme ? "#212842" : "rgba(0, 255, 165, .3)"}
            highlightColor={theme ? "#42495e" : "rgba(0, 255, 165, .2)"}
          >
            <div className="rounded-2xl border-[3px] border-primary border-opacity-45 dark:border-opacity-100 p-5 dark:border-[#212842]">
              <div>
                <Skeleton
                  height={190}
                  borderRadius={"1rem"}
                  style={{}}
                  className="mb-12"
                />
                <Skeleton
                  height={30}
                  style={{ width: "75%" }}
                  borderRadius={"10px"}
                  className="mb-4"
                />
                <Skeleton count={3} borderRadius={"5px"} />
              </div>
              <div className="my-3 flex items-center justify-between">
                <Skeleton borderRadius={"5px"} width={150} />
                <Skeleton circle width={50} height={50} />
              </div>
              <Skeleton count={3} borderRadius={"5px"} />
            </div>
          </SkeletonTheme>
        ))}
    </>
  );
};

export default CardSkeleton;
