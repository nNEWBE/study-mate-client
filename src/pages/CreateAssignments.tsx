import Reveal from "../animation/Reveal";
import TextReveal from "../animation/TextReveal";
import TextScramble from "../animation/TextScramble";
import Unhidden from "../animation/Unhidden";
import Button from "../components/ui/Button";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { useContext, useState } from "react";
import { useToggle } from "../context/ToggleProvider";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCreateAssignmentMutation } from "../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../utils/errorHandler";

type FormInputs = {
  title: string;
  difficulty: string;
  photo: string;
  marks: string;
  description: string;
};

const CreateAssignments = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();
  const { theme } = useToggle();
  const [createAssignment] = useCreateAssignmentMutation();
  console.log(date?.toLocaleDateString("en-US"));

  const [selectedDifficulty, setSelectedDifficulty] = useState<{ name: string } | null>(null);
  const difficulties = [{ name: "Easy" }, { name: "Medium" }, { name: "Hard" }];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const title = data.title;
    const photoURL = data.photo;
    const marks = data.marks;
    const description = data.description;

    const assignmentData = {
      title,
      photoURL,
      marks,
      date: date?.toLocaleDateString("en-US"),
      description,
      difficulty: selectedDifficulty?.name,
      person: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
      status: "not submitted",
    };


    try {
      await createAssignment(assignmentData).unwrap();
      toast.success("Assignment created successfully!");
      navigate("/tasks");
    } catch (err: any) {
      console.log(err);
      toast.error(getErrorMessage(err, "Failed to create assignment"));
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mx-auto w-[90%] bg-white py-32 dark:bg-secondary"
      data-cursor="create"
    >
      <div className="flex justify-center">
        <Reveal>
          <TextScramble>Create Assigments</TextScramble>
        </Reveal>
      </div>

      <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
        <Unhidden>
          <TextReveal className="text-center">
            Create assignments effortlessly by filling in the title,
            description, thumbnail, due date, and difficulty level.
          </TextReveal>
        </Unhidden>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-10 flex flex-col items-center overflow-hidden rounded-3xl border-2 border-primary bg-primary bg-opacity-10 p-10 shadow-2xl backdrop-blur-[20px] backdrop-filter dark:border-white dark:border-opacity-[0.3] dark:bg-transparent sm:w-full lg:w-[50rem]"
      >
        <p className="mb-16 text-center font-poppins text-4xl font-bold text-secondary dark:text-white sm:mb-10">
          Create
          <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
            Now
          </span>
        </p>

        <div className="flex flex-col gap-0 md:flex-row md:gap-5 lg:gap-10">
          <div className="relative w-[16.6rem] sm:w-[20rem]">
            <input
              {...register("title", {
                required: {
                  value: true,
                  message: "Enter assignment title",
                },
              })}
              type="text"
              placeholder="Title"
              className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
            />
            {errors.title ? (
              <div
                role="alert"
                className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
              >
                <MdError />
                <span>{errors.title.message}</span>
              </div>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}
            <div className="absolute right-4 top-3">
              <box-icon
                name="text"
                color={`${theme ? "white" : "black"}`}
              ></box-icon>
            </div>
          </div>

          <div className="relative w-[16.6rem] sm:w-[20rem]">
            <input
              disabled
              defaultValue={user?.email || ""}
              type="email"
              placeholder="Email"
              className="mx-auto w-[16.6rem] cursor-not-allowed select-none rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
            />
            <div className="h-[1.5rem]"></div>
            <div className="absolute right-4 top-3">
              <box-icon
                name="envelope"
                color={`${theme ? "white" : "black"}`}
              ></box-icon>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-0 md:flex-row md:gap-5 lg:gap-10">
          <div className="mb-[1.5rem]">
            <Calendar
              id="buttondisplay"
              value={date}
              onChange={(e) => setDate(e.value as Date | null)}
              placeholder={date?.toLocaleDateString("en-US")}
              dateFormat="yy/mm/dd"
              showIcon
            />
          </div>

          <div>
            <Dropdown
              {...register("difficulty", {
                required: {
                  value: true,
                  message: "Enter assignment difficulty",
                },
              })}
              inputId="dd-city"
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.value);
                setValue("difficulty", e.value?.name, { shouldValidate: true });
              }}
              options={difficulties}
              optionLabel="name"
              className="w-full"
              placeholder="Difficulty"
            />
            {errors.difficulty ? (
              <div
                role="alert"
                className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
              >
                <MdError />
                <span>{errors.difficulty.message}</span>
              </div>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0 md:flex-row md:gap-5 lg:gap-10">
          <div className="relative">
            <input
              {...register("photo", {
                required: {
                  value: true,
                  message: "Enter your photo url",
                },
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: "Enter a valid url",
                },
              })}
              type="text"
              placeholder="Photo Url"
              className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
            />
            {errors.photo ? (
              <div
                role="alert"
                className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
              >
                <MdError />
                <span>{errors.photo.message}</span>
              </div>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}

            <div className="absolute right-4 top-3">
              <box-icon
                name="link-alt"
                color={`${theme ? "white" : "black"}`}
              ></box-icon>
            </div>
          </div>

          <div className="relative w-[16.6rem] sm:w-[20rem]">
            <input
              {...register("marks", {
                required: {
                  value: true,
                  message: "Enter assignment marks",
                },
                pattern: {
                  value: /^\d+$/,
                  message: "Enter numbers only",
                },
              })}
              type="text"
              placeholder="Marks"
              className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
            />
            {errors.marks ? (
              <div
                role="alert"
                className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
              >
                <MdError />
                <span>{errors.marks.message}</span>
              </div>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}
            <div className="absolute right-4 top-3">
              <HiOutlineDocumentChartBar
                strokeWidth="1.9"
                className="text-[25px] text-secondary dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="relative h-full">
          <textarea
            {...register("description", {
              required: {
                value: true,
                message: "Enter assigment description",
              },
            })}
            className="mx-auto w-[16.5rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem] md:w-[41.3rem] lg:w-[42.5rem]"
            placeholder="Description"
          ></textarea>
          {errors.description ? (
            <div
              role="alert"
              className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
            >
              <MdError />
              <span>{errors.description.message}</span>
            </div>
          ) : (
            <div className="h-[1.5rem]"></div>
          )}
          <div className="absolute right-4 top-3">
            <box-icon
              name="comment-dots"
              color={`${theme ? "white" : "black"}`}
            ></box-icon>
          </div>
        </div>

        <div className="mt-3 flex w-[43.5rem] justify-center px-5 md:justify-end lg:w-full">
          <div className="w-[16rem] sm:w-[20rem]">
            <Button str={"Submit"} shadow={true}></Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateAssignments;
