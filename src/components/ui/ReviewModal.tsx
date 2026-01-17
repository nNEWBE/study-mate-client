import BackDrop from "./BackDrop";
import { motion, Variants } from "framer-motion";
import Button from "./Button";
import TextScramble from "../../animation/TextScramble";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdError } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAddReviewMutation } from "../../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../../utils/errorHandler";

interface ReviewModalProps {
    handleClose: () => void;
    assignmentId: string;
}

interface FormData {
    rating: number;
    feedback: string;
}

const ReviewModal = ({ handleClose, assignmentId }: ReviewModalProps): JSX.Element => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [addReview, { isLoading }] = useAddReviewMutation();

    const dropIn: Variants = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 500 } },
        exit: { y: "100vh", opacity: 0 },
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        try {
            await addReview({ id: assignmentId, rating, feedback: data.feedback }).unwrap();
            toast.success("Review added successfully");
            handleClose();
        } catch (err: any) {
            toast.error(getErrorMessage(err, "Failed to add review"));
        }
    };

    return (
        <BackDrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="relative w-[90%] max-w-lg rounded-3xl border-2 border-secondary bg-white text-secondary shadow-[0px_0px_5px_2px] shadow-primary dark:bg-secondary dark:text-white"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="p-8">
                    <div className="mb-6 text-center">
                        <TextScramble>Rate Assignment</TextScramble>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Rating Stars */}
                        <div className="mb-6 flex justify-center gap-2">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <label key={index} className="cursor-pointer transition-transform hover:scale-110">
                                        <input
                                            type="radio"
                                            className="hidden"
                                            value={starValue}
                                            onClick={() => { setRating(starValue); setValue('rating', starValue); }}
                                        />
                                        <FaStar
                                            size={40}
                                            className="transition-colors duration-200"
                                            color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(starValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>

                        {/* Feedback Textarea */}
                        <div className="mb-6">
                            <textarea
                                {...register("feedback", { required: "Feedback is required" })}
                                placeholder="Share your thoughts about this assignment..."
                                className="w-full rounded-xl border-2 border-primary/30 bg-primary/5 p-4 font-poppins outline-none focus:border-primary dark:bg-white/5"
                                rows={4}
                            />
                            {errors.feedback && (
                                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                    <MdError /> {errors.feedback.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <div onClick={handleSubmit(onSubmit)}>
                                <Button shadow={true} str={isLoading ? "Submitting..." : "Submit Review"} disabled={isLoading} />
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </BackDrop>
    );
};

export default ReviewModal;
