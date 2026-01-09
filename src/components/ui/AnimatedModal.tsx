import BackDrop from "./BackDrop";
import { motion, Variants } from "framer-motion";
import Button from "./Button";
import TextScramble from "../../animation/TextScramble";
import { LuUpload } from "react-icons/lu";
import { VscFeedback } from "react-icons/vsc";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { MdError } from "react-icons/md";
import { useState, ChangeEvent } from "react";
import useAuth from "../../hooks/useAuth";

interface AnimatedModalProps {
  handleClose: () => void;
}

interface FormData {
  file: FileList;
  feedback: string;
}

const AnimatedModal = ({ handleClose }: AnimatedModalProps): JSX.Element => {
  const [fileName, setFileName] = useState<string>("Upload File");
  const { user } = useAuth();

  const dropIn: Variants = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const file = data.file[0];
    const feedback = data.feedback;

    const submitData = {
      PDF: file,
      feedback: feedback,
      status: "pending",
      submittedBy: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };
    console.log(submitData);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const conditionalClose = async (): Promise<void> => {
    const isValid = await trigger();
    if (isValid) {
      handleClose();
    }
  };

  return (
    <BackDrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[30rem] w-[85%] rounded-3xl border-2 border-secondary bg-white text-secondary shadow-[0px_0px_5px_2px] shadow-primary dark:bg-secondary dark:text-white md:w-[40rem]"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.5}
      >
        <div className="px-5 py-10">
          <TextScramble>Submit Assignment</TextScramble>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mx-auto w-[16rem] sm:w-[20rem]">
            <label
              htmlFor="file"
              className="mx-auto block w-[16rem] cursor-pointer rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
            >
              {fileName}
            </label>
            {errors.file ? (
              <div
                role="alert"
                className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
              >
                <MdError />
                <span>{errors.file.message}</span>
              </div>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}
            <LuUpload
              className="absolute right-4 top-3.5 size-5"
              strokeWidth="2.2"
            />
          </div>
          <input
            {...register("file", {
              required: {
                value: true,
                message: "Enter assignment file",
              },
              validate: {
                isPdf: (value) =>
                  (value && value[0] && /\.pdf$/i.test(value[0].name)) ||
                  "Only PDF files are allowed",
              },
            })}
            onChange={handleFileChange}
            type="file"
            accept="application/pdf"
            name="file"
            id="file"
            className="absolute opacity-0"
          />

          <div className="relative mx-auto w-[16rem] sm:w-[20rem]">
            <textarea
              {...register("feedback", {
                required: {
                  value: true,
                  message: "Enter a feedback",
                },
              })}
              placeholder="Feedback"
              className="mx-auto w-[16rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
            ></textarea>
            {errors.feedback ? (
              <div
                role="alert"
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <MdError />
                <span>{errors.feedback.message}</span>
              </div>
            ) : (
              <div className="h-[1.5rem]"></div>
            )}
            <VscFeedback
              className="absolute right-4 top-3.5 text-[22px]"
              strokeWidth=".25"
            />
          </div>
          <div className="absolute bottom-10 flex w-full justify-center">
            <div onClick={conditionalClose}>
              <Button shadow={true} str="Submit" />
            </div>
          </div>
        </form>
      </motion.div>
    </BackDrop>
  );
};

export default AnimatedModal;
