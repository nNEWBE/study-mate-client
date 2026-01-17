import toast from "react-hot-toast";
import Reveal from "../animation/Reveal";
import Button from "../components/ui/Button";
import Unhidden from "../animation/Unhidden";
import TextReveal from "../animation/TextReveal";
import TextScramble from "../animation/TextScramble";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import TimePicker from "../components/ui/TimePicker";
import MarkdownEditor from "../components/ui/MarkdownEditor";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToggle } from "../context/ToggleProvider";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAssignmentByIdQuery, useUpdateAssignmentMutation } from "../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../utils/errorHandler";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface UpdateFormInputs {
  title: string;
  marks: string;
  description: string;
  content: string;
  date: string;
  dueTime: string;
}

const UpdateAssignment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useToggle();

  // RTK Query hooks
  const { data: assignment, isLoading: isFetching, isError } = useGetAssignmentByIdQuery(id!, {
    skip: !id,
  });
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium");
  const [selectedDueTime, setSelectedDueTime] = useState<string>("23:59");
  const [isFormReady, setIsFormReady] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateFormInputs>();

  // Populate form when data is loaded
  useEffect(() => {
    if (assignment) {
      const dueDate = assignment.dueDate
        ? new Date(assignment.dueDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      reset({
        title: assignment.title,
        marks: String(assignment.marks),
        description: assignment.description,
        content: assignment.content || assignment.description,
        date: dueDate,
        dueTime: assignment.dueTime || "23:59",
      });
      setSelectedDifficulty(assignment.difficulty || "medium");
      setSelectedDueTime(assignment.dueTime || "23:59");
      setIsFormReady(true);
    }
  }, [assignment, reset]);

  const onSubmit = async (data: UpdateFormInputs) => {
    if (!assignment?._id) return;

    const assignmentData = {
      title: data.title,
      marks: data.marks,
      description: data.description,
      content: data.content,
      difficulty: selectedDifficulty,
      dueDate: data.date,
      dueTime: selectedDueTime,
    };

    try {
      await updateAssignment({ id: assignment._id, data: assignmentData }).unwrap();
      toast.success("Assignment updated successfully!");
      navigate("/tasks");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update assignment"));
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-screen bg-white py-32 dark:bg-secondary">
        <div className="flex justify-center">
          <Skeleton width={300} height={40} baseColor="#1f2937" highlightColor="#00ffa5" />
        </div>
        <div className="mx-auto mt-4 w-3/4 lg:w-[45%]">
          <Skeleton count={1} baseColor="#1f2937" highlightColor="#00ffa5" />
        </div>
        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border-2 border-primary/30 p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton height={50} borderRadius={12} baseColor="#1f2937" highlightColor="#00ffa5" />
            <Skeleton height={50} borderRadius={12} baseColor="#1f2937" highlightColor="#00ffa5" />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Skeleton height={50} borderRadius={12} baseColor="#1f2937" highlightColor="#00ffa5" />
            <Skeleton height={50} borderRadius={12} baseColor="#1f2937" highlightColor="#00ffa5" />
          </div>
          <div className="mt-6">
            <Skeleton height={100} borderRadius={12} baseColor="#1f2937" highlightColor="#00ffa5" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !assignment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-secondary">
        <h1 className="mb-4 font-dosis text-4xl font-bold text-red-500">
          Assignment Not Found
        </h1>
        <p className="mb-8 font-edu text-secondary/70 dark:text-white/70">
          The assignment you're trying to edit doesn't exist or has been removed.
        </p>
        <div className="w-40" onClick={() => navigate("/tasks")}>
          <Button str="Back to Tasks" shadow={true} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-white py-32 dark:bg-secondary"
    >
      <div className="flex justify-center">
        <Reveal>
          <TextScramble>Update Assignment</TextScramble>
        </Reveal>
      </div>

      <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
        <Unhidden>
          <TextReveal className="text-center">
            Update your assignment details below.
          </TextReveal>
        </Unhidden>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-10 flex max-w-4xl flex-col gap-6 overflow-hidden rounded-3xl border-2 border-primary bg-primary bg-opacity-10 p-6 shadow-2xl backdrop-blur-[20px] backdrop-filter dark:border-white dark:border-opacity-[0.3] dark:bg-transparent sm:p-10"
      >
        <p className="mb-6 text-center font-poppins text-4xl font-bold text-secondary dark:text-white sm:mb-10">
          Update
          <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary/5 px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
            Now
          </span>
        </p>

        {/* Title & Email */}
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Title"
            required
            placeholder="Assignment Title"
            icon={<box-icon name="text" color={theme ? "white" : "#1f2937"}></box-icon>}
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <Input
            label="Creator Email"
            disabled
            defaultValue={assignment.createdBy?.email || ""}
            icon={<box-icon name="envelope" color={theme ? "white" : "#1f2937"}></box-icon>}
            variant="filled"
          />
        </div>

        {/* Date, Marks & Time */}
        <div className="grid gap-6 md:grid-cols-3">
          <Input
            label="Due Date"
            type="date"
            required
            error={errors.date?.message}
            {...register("date", { required: "Date is required" })}
          />

          <Input
            label="Marks"
            type="number"
            required
            placeholder="100"
            icon={<HiOutlineDocumentChartBar className="text-2xl" />}
            error={errors.marks?.message}
            {...register("marks", { required: "Marks are required", pattern: { value: /^\d+$/, message: "Numbers only" } })}
          />

          <TimePicker
            label="Due Time"
            required
            placeholder="Select due time"
            value={selectedDueTime}
            onChange={(time) => {
              setSelectedDueTime(time);
              setValue("dueTime", time, { shouldValidate: true });
            }}
            error={errors.dueTime?.message}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="mb-2 block font-edu font-semibold text-secondary dark:text-white">
            Difficulty <span className="text-primary">*</span>
          </label>
          <div className="flex gap-2">
            {[
              { value: "easy", label: "Easy", selectedColor: "bg-primary", selectedShadow: "shadow-primary", selectedBorder: "border-secondary" },
              { value: "medium", label: "Medium", selectedColor: "bg-blue-500", selectedShadow: "shadow-blue-500", selectedBorder: "border-secondary" },
              { value: "hard", label: "Hard", selectedColor: "bg-red-500", selectedShadow: "shadow-red-500", selectedBorder: "border-secondary" },
            ].map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`flex-1 rounded-xl border-2 px-3 py-2.5 font-dosis font-semibold transition-all ${selectedDifficulty === diff.value
                  ? `${diff.selectedBorder} ${diff.selectedColor} text-secondary shadow-[0_0_5px_2px] ${diff.selectedShadow}`
                  : `border-primary bg-primary/5 text-secondary hover:bg-primary/20 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white`
                  }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description & Content */}
        <div className="grid gap-6">
          <Textarea
            label="Short Description"
            required
            placeholder="Brief summary..."
            autoExpand
            minRows={2}
            icon={<box-icon name="comment-dots" color={theme ? "white" : "#1f2937"}></box-icon>}
            error={errors.description?.message}
            {...register("description", { required: "Description is required" })}
          />

          <MarkdownEditor
            label="Detailed Content"
            placeholder="Full details with **markdown** formatting..."
            error={errors.content?.message}
            helperText="Use markdown to format your content."
            minRows={6}
            {...register("content")}
          />
        </div>

        <div className="mt-4 flex justify-center md:justify-end">
          <div className="w-full sm:w-64">
            <Button str={isUpdating ? "Updating..." : "Update"} shadow={true} disabled={isUpdating} />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateAssignment;
