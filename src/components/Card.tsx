import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import Tilt from "react-parallax-tilt";
import Button from "../animation/Button";
import { useContext } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { ToggleContext } from "../context/ToggleProvider";
import "../styles/style.css";
import { Link } from "react-router-dom";

interface CardData {
  _id: string;
  title: string;
  description: string;
  photoURL: string;
  difficulty: string;
  marks: number;
  person: {
    email: string;
    name: string;
  };
}

interface CardProps {
  d: CardData;
  handleDelete: (id: string, email: string, name: string) => void;
}

const Card = ({ d, handleDelete }: CardProps): JSX.Element => {
  const context = useContext(ToggleContext);
  const theme = context?.theme;

  return (
    <div data-cursor="card">
      <Tilt
        glareEnable={false}
        tiltMaxAngleY={5}
        tiltMaxAngleX={5}
        glareBorderRadius="10px"
        className="flex flex-col justify-between rounded-2xl border-2 border-secondary bg-transparent px-2.5 py-1 pt-2 shadow-[0px_0px_5px_2px] shadow-primary backdrop-blur-[20px]"
      >
        <div className="threeD-effect relative m-4 h-[190px] overflow-hidden rounded-2xl shadow-[0px_0px_15px_2px] shadow-primary">
          <img
            className="h-[190px] w-full scale-[1.01] rounded-2xl object-cover shadow-xl transition-all duration-1000 hover:scale-110"
            src={`${d.photoURL}`}
            alt={d.title}
          />
          <div className="absolute right-3 top-3 flex h-[2rem] w-[5rem] items-center justify-center overflow-hidden rounded-[10px] text-sm font-bold">
            <div className="border-rotate relative h-[2rem] w-[5rem] bg-white text-center font-edu dark:bg-secondary">
              <div className="absolute left-[2.3px] top-[2px] h-[1.7rem] w-[4.7rem] rounded-[8px] bg-white text-primary shadow-[0px_0px_2px_0px] shadow-secondary dark:bg-secondary">
                <p
                  style={{
                    filter: " drop-shadow(1px 1px 1px var(--secondary))",
                  }}
                  className="relative top-[2px] flex items-center justify-center"
                >
                  {d.difficulty}
                </p>
              </div>
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
            <Link to={`assignment/${d._id}`} className="-rotate-45 cursor-pointer rounded-full border-2 border-secondary bg-white p-2 text-2xl text-secondary shadow-[0px_0px_5px_2px] shadow-primary">
              <IoMdArrowRoundForward />
            </Link>
          </div>
          <div className="mt-7 flex items-center justify-between">
            <div
              onClick={() => handleDelete(d._id, d.person.email, d.person.name)}
              className="w-[6.8rem] sm:w-[7.5rem] lg:w-[7.6rem]"
            >
              <Button str="Delete" shadow={true} />
            </div>
            <Link to={`update/${d._id}`} className="w-[7.7rem] lg:w-[8.2rem]">
              <Button str="Update" shadow={true} />
            </Link>
          </div>
        </div>
      </Tilt>
    </div>
  );
};

export default Card;
