import Reveal from "../animation/Reveal";
import TextReveal from "../animation/TextReveal";
import TextScramble from "../animation/TextScramble";
import Unhidden from "../animation/Unhidden";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import DatePicker from "../components/ui/DatePicker";
import toast from "react-hot-toast";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdCloudUpload, MdImage } from "react-icons/md";
import { useState, useRef, useCallback } from "react";
import { useToggle } from "../context/ToggleProvider";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCreateAssignmentMutation } from "../redux/features/assignments/assignmentApi";
import { useGetAllCategoriesQuery } from "../redux/features/categories/categoryApi";
import { getErrorMessage } from "../utils/errorHandler";
import { useAppSelector } from "../redux/store";

type FormInputs = {
  title: string;
  description: string;
  marks: string;
  content: string;
  difficulty: string;
  categoryId: string;
  dueDate: string;
  dueTime: string;
};

interface FilePreview {
  file: File;
  preview: string;
  id: string;
}

const MAX_DESCRIPTION_CHARS = 200;

const CreateAssignments = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { theme } = useToggle();
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDueDate, setSelectedDueDate] = useState<string>("");
  const [selectedDueTime, setSelectedDueTime] = useState<string>("23:59");
  const [thumbnails, setThumbnails] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert categories to Select options
  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormInputs>();

  const descriptionValue = useWatch({ control, name: "description", defaultValue: "" });
  const charCount = descriptionValue ? descriptionValue.length : 0;
  const isOverLimit = charCount > MAX_DESCRIPTION_CHARS;

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles: FilePreview[] = [];
    const remainingSlots = 5 - thumbnails.length;

    if (remainingSlots <= 0) {
      toast.error("Maximum 5 thumbnails allowed");
      return;
    }

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        continue;
      }
      newFiles.push({ file, preview: URL.createObjectURL(file), id: generateId() });
    }

    if (newFiles.length > 0) setThumbnailError(false);
    setThumbnails(prev => [...prev, ...newFiles]);
  }, [thumbnails.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeThumbnail = (id: string) => {
    setThumbnails(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (thumbnails.length === 0) {
      setThumbnailError(true);
      toast.error("Please upload at least one thumbnail");
      return;
    }
    if (isOverLimit) {
      toast.error(`Description exceeds ${MAX_DESCRIPTION_CHARS} characters`);
      return;
    }

    const formData = new FormData();
    thumbnails.forEach(thumb => formData.append('thumbnails', thumb.file));

    const assignmentData = {
      title: data.title,
      description: data.description,
      marks: Number(data.marks),
      content: data.content,
      difficulty: selectedDifficulty || 'medium',
      categoryId: selectedCategory,
      dueDate: data.dueDate,
      dueTime: selectedDueTime || '23:59',
      createdBy: {
        name: user?.displayName || '',
        email: user?.email || '',
        role: user?.role || 'student',
        profileImage: user?.photoURL || '',
      },
    };

    formData.append('data', JSON.stringify(assignmentData));

    try {
      await createAssignment(formData).unwrap();
      toast.success("Assignment created successfully!");
      thumbnails.forEach(thumb => URL.revokeObjectURL(thumb.preview));
      navigate("/tasks");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to create assignment"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative min-h-screen overflow-hidden bg-white py-32 dark:bg-secondary"
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl dark:bg-primary/8" />

      <div className="relative mx-auto w-[90%] max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center">
            <Reveal>
              <TextScramble>Create Assignment</TextScramble>
            </Reveal>
          </div>
          <div className="relative mx-auto sm:w-3/4 lg:w-[60%]">
            <Unhidden>
              <TextReveal className="text-center">
                Create engaging assignments with detailed instructions and thumbnails.
              </TextReveal>
            </Unhidden>
          </div>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-3xl border-2 border-primary bg-primary bg-opacity-10 p-6 backdrop-blur-[20px] backdrop-filter dark:border-white dark:border-opacity-[0.3] dark:bg-transparent sm:p-10"
        >
          {/* Form Title */}
          <p className="mb-12 text-center font-poppins text-3xl font-bold text-secondary dark:text-white">
            Create
            <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
              Now
            </span>
          </p>

          {/* Row 1: Title */}
          <div className="mb-5">
            <Input
              label="Title"
              required
              placeholder="Assignment title"
              icon={<box-icon name="text" color={theme ? "white" : "#1f2937"}></box-icon>}
              error={errors.title?.message}
              {...register("title", { required: "Title is required" })}
            />
          </div>

          {/* Row 2: Marks, Due Date & Due Time */}
          <div className="mb-5 grid gap-5 md:grid-cols-3">
            <Input
              label="Marks"
              required
              type="number"
              placeholder="100"
              icon={<HiOutlineDocumentChartBar className="text-2xl" />}
              error={errors.marks?.message}
              {...register("marks", {
                required: "Marks required",
                pattern: { value: /^\d+$/, message: "Numbers only" }
              })}
            />

            <DatePicker
              label="Due Date"
              required
              placeholder="Select due date"
              value={selectedDueDate}
              onChange={(date) => {
                setSelectedDueDate(date);
                setValue("dueDate", date, { shouldValidate: true });
              }}
              minDate={new Date()}
              error={errors.dueDate?.message}
            />

            {/* Due Time */}
            <div>
              <label className="mb-2 block font-edu font-semibold text-secondary dark:text-white">
                Due Time <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={selectedDueTime}
                  onChange={(e) => {
                    setSelectedDueTime(e.target.value);
                    setValue("dueTime", e.target.value, { shouldValidate: true });
                  }}
                  className="w-full rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-3 font-poppins text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-white/5 dark:text-white"
                />
              </div>
              <p className="mt-1 text-xs text-secondary/50 dark:text-white/50">
                24-hour format (e.g., 23:59)
              </p>
            </div>
          </div>

          {/* Row 3: Difficulty & Category */}
          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            {/* Difficulty - Button Style */}
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
                    onClick={() => {
                      setSelectedDifficulty(diff.value);
                      setValue("difficulty", diff.value, { shouldValidate: true });
                    }}
                    className={`flex-1 rounded-xl border-2 px-3 py-2.5 font-dosis font-semibold transition-all ${selectedDifficulty === diff.value
                      ? `border-secondary ${diff.color} text-secondary shadow-[0_0_5px_2px] ${diff.shadow}`
                      : `${diff.border} ${diff.color} bg-opacity-10 text-secondary ${diff.hoverBg} dark:bg-opacity-20 dark:text-white`
                      }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
              {errors.difficulty && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Select difficulty
                </p>
              )}
            </div>

            <Select
              label="Category"
              required
              options={categoryOptions}
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                setValue("categoryId", value, { shouldValidate: true });
              }}
              placeholder="Select a category"
              loading={isCategoriesLoading}
              searchable
              error={errors.categoryId ? "Select a category" : undefined}
            />
          </div>

          {/* Thumbnails */}
          <div className="mb-5">
            <label className="mb-2 block font-edu font-semibold text-secondary dark:text-white">
              Thumbnails <span className="text-primary">*</span>
              <span className="ml-2 text-sm font-normal text-secondary/60 dark:text-white/60">(Max 5 images, 5MB each)</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${isDragging
                ? 'border-primary bg-primary/30 shadow-[0_0_10px_2px] shadow-primary'
                : thumbnailError
                  ? 'border-red-400 bg-red-50 dark:bg-red-500/10'
                  : 'border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]'
                }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleInputChange} className="hidden" />
              <MdCloudUpload className={`mx-auto text-4xl ${isDragging ? 'text-primary' : 'text-secondary/50 dark:text-white/50'}`} />
              <p className="mt-2 font-edu font-semibold text-secondary dark:text-white">
                {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
              </p>
              <p className="text-sm font-dosis text-secondary/60 dark:text-white/60">{thumbnails.length}/5 images selected</p>
            </div>

            {thumbnailError && thumbnails.length === 0 && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                At least one thumbnail is required
              </p>
            )}

            {/* Preview Grid */}
            <AnimatePresence>
              {thumbnails.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5"
                >
                  {thumbnails.map((thumb) => (
                    <motion.div
                      key={thumb.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative aspect-square overflow-hidden rounded-xl border-2 border-primary/30 shadow-md"
                    >
                      <img src={thumb.preview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeThumbnail(thumb.id); }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
                        >
                          <MdClose />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 rounded bg-secondary/70 px-1.5 py-0.5">
                        <MdImage className="text-xs text-white" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Short Description */}
          <Textarea
            label="Short Description"
            required
            placeholder="Brief summary of the assignment..."
            rows={3}
            icon={<box-icon name="comment-dots" color={theme ? "white" : "#1f2937"}></box-icon>}
            showCount
            maxCount={MAX_DESCRIPTION_CHARS}
            currentCount={charCount}
            error={errors.description?.message}
            className="mb-5"
            {...register("description", {
              required: "Description is required",
              validate: (v) => (v?.length || 0) <= MAX_DESCRIPTION_CHARS || "Exceeds character limit"
            })}
          />

          {/* Detailed Content */}
          <Textarea
            label="Detailed Instructions"
            required
            placeholder="Comprehensive instructions, requirements, and guidelines..."
            rows={5}
            icon={<box-icon name="file" color={theme ? "white" : "#1f2937"}></box-icon>}
            error={errors.content?.message}
            className="mb-8"
            {...register("content", {
              required: "Content is required",
              minLength: { value: 50, message: "At least 50 characters required" }
            })}
          />

          {/* Submit Button */}
          <div className="flex justify-center sm:justify-end">
            <div className="w-full sm:w-64">
              <Button str={isCreating ? "Creating..." : "Create"} shadow={true} disabled={isCreating} />
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateAssignments;
