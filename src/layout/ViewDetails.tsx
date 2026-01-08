import {
  BsCalendarDateFill,
  BsFillFileEarmarkBarGraphFill,
} from "react-icons/bs";
import { CgTimelapse } from "react-icons/cg";
import { useLoaderData } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import TextScramble from "../animation/TextScramble";
import Reveal from "../animation/Reveal";
import Unhidden from "../animation/Unhidden";
import TextReveal from "../animation/TextReveal";
import Button from "../animation/Button";
import { useState } from "react";
import AnimatedModal from "../animation/AnimatedModal";
import { AnimatePresence } from "framer-motion";

interface AssignmentData {
  title: string;
  description: string;
  photoURL: string;
  difficulty: string;
  marks: string;
  date: string;
  status: string;
  person: {
    name: string;
    email: string;
    photo: string;
  };
}

const ViewDetails = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const data = useLoaderData() as AssignmentData;
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <div className="mx-auto w-[90%] bg-white py-32 dark:bg-secondary">
      <div className="flex justify-center">
        <Reveal>
          <TextScramble>{data.title}</TextScramble>
        </Reveal>
      </div>

      <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
        <Unhidden>
          <TextReveal>{data.description}</TextReveal>
        </Unhidden>
      </div>

      <div className="relative mx-auto mt-16 w-full rounded-2xl shadow-[0_0_10px_2px] shadow-primary sm:mt-10 lg:w-[55vw]">
        <img
          src={data.photoURL}
          alt={data.title}
          className="w-full rounded-2xl object-cover lg:w-[55vw]"
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
                {data.difficulty}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto my-3 mt-10 flex flex-col justify-between gap-5 text-secondary dark:text-white sm:flex-row sm:gap-0 lg:w-[50rem]">
        <p className="font-edu text-lg font-medium">
          <BsCalendarDateFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary"></BsCalendarDateFill>
          <span
            className="text-primary"
            style={{
              filter: " drop-shadow(1px 1px 1px var(--secondary))",
            }}
          >
            Published :{" "}
          </span>
          {data.date}
        </p>
        <p className="font-edu text-lg font-medium">
          <BsFillFileEarmarkBarGraphFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary"></BsFillFileEarmarkBarGraphFill>
          <span
            className="text-primary"
            style={{
              filter: " drop-shadow(1px 1px 1px var(--secondary))",
            }}
          >
            Marks :{" "}
          </span>
          {data.marks}
        </p>
        <p className="font-edu text-lg font-medium capitalize">
          <CgTimelapse className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary"></CgTimelapse>
          <span
            className="text-primary"
            style={{
              filter: " drop-shadow(1px 1px 1px var(--secondary))",
            }}
          >
            Status :{" "}
          </span>
          {data.status}
        </p>
      </div>

      <h1 className="mx-auto mb-7 mt-10 font-dosis text-4xl font-bold text-secondary dark:text-white lg:w-[50rem]">
        Author Details
        <span className="text-5xl font-bold text-primary">.</span>
      </h1>

      <div className="mx-auto flex flex-col items-center justify-between text-secondary dark:text-white sm:flex-row lg:w-[50rem]">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
          <div>
            <p className="font-edu text-lg font-medium capitalize">
              {" "}
              <IoPersonSharp className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />{" "}
              <span
                className="font-edu text-lg font-medium text-primary"
                style={{
                  filter: " drop-shadow(1px 1px 1px var(--secondary))",
                }}
              >
                Name :{" "}
              </span>
              {data.person.name}
            </p>
            <p className="my-5 font-edu text-lg font-medium">
              {" "}
              <MdEmail className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />{" "}
              <span
                className="font-edu text-lg font-medium text-primary"
                style={{
                  filter: " drop-shadow(1px 1px 1px var(--secondary))",
                }}
              >
                Email :{" "}
              </span>
              {data.person.email}
            </p>
          </div>
          <div>
            <img
              className="h-[70px] shadow-primary shadow-[0px_0px_7px_2px] border-2 border-secondary w-[70px] rounded-full object-cover"
              src={data.person.photo}
              alt={data.person.name}
            />
          </div>
        </div>
        <div
          onClick={() => (modalOpen ? close() : open())}
          className="mt-10 w-[7rem]"
        >
          <Button str="Take" shadow={true} />
        </div>
      </div>
      <AnimatePresence initial={false} >
        {modalOpen && (
          <AnimatedModal handleClose={close} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewDetails;
