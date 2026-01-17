import toast from "react-hot-toast";
import Reveal from "../animation/Reveal";
import Button from "../components/ui/Button";
import Unhidden from "../animation/Unhidden";
import TextReveal from "../animation/TextReveal";
import TextScramble from "../animation/TextScramble";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToggle } from "../context/ToggleProvider";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useUpdateAssignmentMutation } from "../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../utils/errorHandler";
import { MdCloudUpload, MdClose, MdImage } from "react-icons/md";

interface AssignmentData {
  _id: string;
  title: string;
  thumbnailUrl: string[]; // Updated to match array format
  photoURL?: string; // Legacy support
  description: string;
  marks: string;
  difficulty: string;
  content?: string;
  person: {
    email: string;
    name: string;
    photo: string;
  };
  dueDate: string;
  date?: string; // Legacy
  categoryId?: string;
}

interface UpdateFormInputs {
  title: string;
  marks: string;
  description: string;
  content: string;
  date: string;
}

const UpdateAssignment = () => {
  const assignment = useLoaderData() as AssignmentData;
  const { _id, title, description, marks, difficulty, person, content } = assignment;

  // Handle legacy date field
  const defaultDate = assignment.dueDate ? new Date(assignment.dueDate) :
    assignment.date ? new Date(assignment.date) : new Date();

  const navigate = useNavigate();
  const { theme } = useToggle();
  const [updateAssignment, { isLoading }] = useUpdateAssignmentMutation();

  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty || "medium");
  const [dueDate, setDueDate] = useState<string>(defaultDate.toISOString().split('T')[0]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateFormInputs>({
    defaultValues: {
      title,
      marks,
      description,
      content: content || description, // Fallback
    }
  });

  const onSubmit = async (data: UpdateFormInputs) => {
    const assignmentData = {
      title: data.title,
      marks: data.marks,
      description: data.description,
      content: data.content,
      difficulty: selectedDifficulty,
      dueDate: data.date,
      // We don't update thumbnails/images here to simplify, or user should use Create for new ones
      // But if we need to support it, it's more complex. 
      // For now, let's keep the core text fields updateable.
      person: {
        email: person?.email,
        name: person?.name,
        photo: person?.photo,
      },
    };

    try {
      await updateAssignment({ id: _id, data: assignmentData }).unwrap();
      toast.success("Assignment updated successfully!");
      navigate("/tasks");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update assignment"));
    }
  };

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
            defaultValue={title}
            placeholder="Assignment Title"
            icon={<box-icon name="text" color={theme ? "white" : "#1f2937"}></box-icon>}
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <Input
            label="Creator Email"
            disabled
            defaultValue={person?.email}
            icon={<box-icon name="envelope" color={theme ? "white" : "#1f2937"}></box-icon>}
            variant="filled"
          />
        </div>

        {/* Date & Marks */}
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Due Date"
            type="date"
            defaultValue={dueDate}
            required
            error={errors.date?.message}
            {...register("date", { required: "Date is required" })}
          />

          <Input
            label="Marks"
            type="number"
            required
            defaultValue={marks}
            placeholder="100"
            icon={<HiOutlineDocumentChartBar className="text-2xl" />}
            error={errors.marks?.message}
            {...register("marks", { required: "Marks are required", pattern: { value: /^\d+$/, message: "Numbers only" } })}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="mb-2 block font-edu font-semibold text-secondary dark:text-white">
            Difficulty <span className="text-primary">*</span>
          </label>
          <div className="flex gap-2">
            {[
              { value: "easy", label: "Easy", color: "bg-primary", shadow: "shadow-primary", border: "border-primary", hoverBg: "hover:bg-primary/40" },
              { value: "medium", label: "Medium", color: "bg-blue-500", shadow: "shadow-blue-500", border: "border-blue-500", hoverBg: "hover:bg-blue-500/40" },
              { value: "hard", label: "Hard", color: "bg-red-500", shadow: "shadow-red-500", border: "border-red-500", hoverBg: "hover:bg-red-500/40" },
            ].map((diff) => (
              <button
                key={diff.value}
                type="button"
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`flex-1 rounded-xl border-2 px-3 py-2.5 font-dosis font-semibold transition-all ${selectedDifficulty === diff.value
                    ? `border-secondary ${diff.color} text-white shadow-[0_0_5px_2px] ${diff.shadow}`
                    : `${diff.border} ${diff.color} bg-opacity-10 text-secondary ${diff.hoverBg} dark:bg-opacity-20 dark:text-white`
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
            defaultValue={description}
            placeholder="Brief summary..."
            rows={3}
            icon={<box-icon name="comment-dots" color={theme ? "white" : "#1f2937"}></box-icon>}
            error={errors.description?.message}
            {...register("description", { required: "Description is required" })}
          />

          <Textarea
            label="Detailed Content"
            defaultValue={content}
            placeholder="Full details..."
            rows={5}
            icon={<box-icon name="file" color={theme ? "white" : "#1f2937"}></box-icon>}
            error={errors.content?.message}
            {...register("content")}
          />
        </div>

        <div className="mt-4 flex justify-center md:justify-end">
          <div className="w-full sm:w-64">
            <Button str={isLoading ? "Updating..." : "Update"} shadow={true} disabled={isLoading} />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateAssignment;
