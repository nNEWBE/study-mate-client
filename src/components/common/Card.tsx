import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import Tilt from "react-parallax-tilt";
import Button from "../ui/Button";
import { useContext } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useToggle } from "../../context/ToggleProvider";
import "../../styles/style.css";
import { Link } from "react-router-dom";
import { Assignment } from "../../types";

interface CardProps {
  d: Assignment;
  handleDelete: (id: string, email: string, name: string) => void;
}

const Card = ({ d, handleDelete }: CardProps): JSX.Element => {
  const { theme } = useToggle();

  return (
    <div>
      <Tilt
        glareEnable={false}
        tiltMaxAngleY={5}
        tiltMaxAngleX={5}
        glareBorderRadius="10px"
        className="flex flex-col justify-between rounded-2xl border-2 border-secondary bg-transparent px-2.5 py-1 pt-2 shadow-[0px_0px_5px_2px] shadow-primary backdrop-blur-[20px]"
      >
        <div className="threeD-effect relative m-4 h-[190px] overflow-hidden rounded-2xl shadow-[0px_0px_15px_2px] shadow-primary">
          <Link to={`assignment/${d._id}`} className="card-view-link" data-cursor="card">
            <img
              className="h-[190px] w-full scale-[1.01] rounded-2xl object-cover shadow-xl transition-all duration-1000 hover:scale-110"
              src={`${d.photoURL || (d as any).thumbnail || (d as any).thumbnailUrl?.[0]}`}
              alt={d.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/600x400/1f2937/00ffa5?text=Assignment";
              }}
            />
          </Link>
          <div className="absolute right-3 top-3 text-sm font-bold">
            <div className="border-rotate flex h-[2rem] w-[5rem] items-center justify-center bg-white font-edu text-primary dark:bg-secondary">
              <p
                style={{
                  filter: " drop-shadow(1px 1px 1px var(--secondary))",
                }}
              >
                {d.difficulty}
              </p>
            </div>
          </div>
        </div>

        <div className="m-4 mt-5">
          <h1 className="font-dosis text-2xl font-bold text-secondary dark:text-white">
            {d.title} <span className="text-4xl font-bold text-primary">.</span>
          </h1>
          <div className="mt-5 font-edu font-medium text-secondary dark:text-white">
            <div className="mt-5">
              <BsFillFileEarmarkTextFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
              <p className="inline text-base">
                <span
                  style={{
                    filter: " drop-shadow(1px 1px 1px var(--secondary))",
                  }}
                  className="text-primary"
                >
                  About :{" "}
                </span>{" "}
                {d.description}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between font-edu font-medium text-secondary dark:text-white">
            <div>
              <BsFillFileEarmarkBarGraphFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />

              <p className="inline text-base">
                <span
                  style={{
                    filter: " drop-shadow(1px 1px 1px var(--secondary))",
                  }}
                  className="text-primary"
                >
                  Marks :{" "}
                </span>{" "}
                {d.marks}
              </p>
            </div>
            {/* <Link to={`assignment/${d._id}`} className="-rotate-45 cursor-pointer rounded-full border-2 border-secondary bg-white p-2 text-2xl text-secondary shadow-[0px_0px_5px_2px] shadow-primary">
              <IoMdArrowRoundForward />
            </Link> */}
          </div>
          <div className="mt-7 flex items-center justify-between">
            <div
              onClick={() => handleDelete(d._id, d.person?.email || d.creatorEmail || '', d.person?.name || d.creatorName || '')}
              className="w-[7rem] sm:w-[7.5rem]"
            >
              <Button str="Delete" shadow={true} />
            </div>
            <Link to={`update/${d._id}`} className="w-[7.5rem] sm:w-[8rem]">
              <Button str="Update" shadow={true} />
            </Link>
          </div>
        </div>
      </Tilt>
    </div>
  );
};

export default Card;
