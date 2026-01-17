import {
  BsCalendarDateFill,
  BsFillFileEarmarkBarGraphFill,
  BsPersonFill,
} from "react-icons/bs";
import { CgTimelapse } from "react-icons/cg";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoPersonSharp, IoArrowBack, IoBookmark, IoPlay } from "react-icons/io5";
import { MdEmail, MdAccessTime, MdSchool } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaStar } from "react-icons/fa";
import TextScramble from "../animation/TextScramble";
import Reveal from "../animation/Reveal";
import Button from "../components/ui/Button";
import { useState } from "react";
import AnimatedModal from "../components/ui/AnimatedModal";
import ReviewModal from "../components/ui/ReviewModal";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useAddToWishlistMutation } from "../redux/features/wishlist/wishlistApi";
import { useGetAssignmentByIdQuery } from "../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../utils/errorHandler";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, EffectFade, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

const ViewDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);
  const closeReview = () => setReviewModalOpen(false);
  const openReview = () => setReviewModalOpen(true);
  const { user } = useAuth();

  // RTK Query hook for fetching single assignment
  const { data, isLoading, isError, error } = useGetAssignmentByIdQuery(id!, {
    skip: !id,
  });

  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();

  const isCreator = data && user?.email === data.createdBy?.email;

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    if (!data?._id) return;
    try {
      await addToWishlist({ assignment: data._id }).unwrap();
      toast.success("Added to Wishlist!");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to add to wishlist"));
    }
  };

  // Get difficulty styles
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return { bg: "bg-primary", text: "text-primary", border: "border-primary", shadow: "shadow-primary" };
      case "medium": return { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", shadow: "shadow-blue-500" };
      case "hard": return { bg: "bg-red-500", text: "text-red-500", border: "border-red-500", shadow: "shadow-red-500" };
      default: return { bg: "bg-primary", text: "text-primary", border: "border-primary", shadow: "shadow-primary" };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-32 dark:bg-secondary">
        <div className="mx-auto w-[90%] max-w-6xl">
          <Skeleton height={400} borderRadius={24} baseColor="#1f2937" highlightColor="#00ffa5" />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton height={60} baseColor="#1f2937" highlightColor="#00ffa5" />
              <Skeleton count={4} className="mt-4" baseColor="#1f2937" highlightColor="#00ffa5" />
            </div>
            <div>
              <Skeleton height={300} borderRadius={16} baseColor="#1f2937" highlightColor="#00ffa5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-secondary">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <HiOutlineDocumentText className="text-5xl text-red-500" />
          </div>
          <h1 className="mb-4 font-dosis text-4xl font-bold text-red-500">
            Assignment Not Found
          </h1>
          <p className="mb-8 max-w-md font-edu text-secondary/70 dark:text-white/70">
            {getErrorMessage(error, "The assignment you're looking for doesn't exist or has been removed.")}
          </p>
          <div className="w-48 mx-auto" onClick={() => navigate("/tasks")}>
            <Button str="Back to Tasks" shadow={true} />
          </div>
        </motion.div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(data.dueDate || "");
  const isOverdue = daysRemaining < 0;
  const difficultyStyles = getDifficultyStyles(data.difficulty);
  const thumbnails = data.thumbnailUrl || [data.photoURL || data.thumbnail].filter(Boolean) as string[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white dark:from-secondary dark:via-secondary dark:to-secondary"
    >
      {/* Hero Section with Image Slider */}
      <div className="relative">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate(-1)}
          className="absolute left-5 top-28 z-20 flex items-center gap-2 rounded-full border-2 border-secondary bg-white/90 px-4 py-2 font-edu font-semibold text-secondary shadow-lg backdrop-blur-sm transition-all hover:bg-primary hover:shadow-primary/50 dark:border-white/30 dark:bg-secondary/90 dark:text-white"
        >
          <IoArrowBack /> Back
        </motion.button>

        {/* Main Image Slider */}
        <div className="relative mx-auto max-w-5xl pt-24 px-5">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border-2 border-primary/30 shadow-xl shadow-primary/10 dark:border-white/10"
          >
            <Swiper
              modules={[Navigation, Pagination, Thumbs, EffectFade, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="h-[350px] w-full sm:h-[400px]"
            >
              {thumbnails.map((url, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <img
                      src={url}
                      alt={`${data.title} - Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Difficulty Badge */}
            <div className="absolute right-4 top-4 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className={`rounded-full ${difficultyStyles.bg} border-2 border-secondary px-4 py-1.5 font-dosis font-bold capitalize text-secondary shadow-lg ${difficultyStyles.shadow} shadow-[0_0_15px_2px]`}
              >
                {data.difficulty}
              </motion.div>
            </div>

            {/* Status Badge */}
            <div className="absolute left-4 top-4 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className={`rounded-full ${data.isExpired ? "bg-red-500" : (isOverdue ? "bg-red-500" : "bg-green-500")} border-2 border-secondary px-4 py-1.5 font-dosis font-bold text-white shadow-lg`}
              >
                {data.isExpired ? "Expired" : (isOverdue ? "Overdue" : `${daysRemaining} days left`)}
              </motion.div>
            </div>
          </motion.div>

          {/* Thumbnail Strip */}
          {thumbnails.length > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3"
            >
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={8}
                slidesPerView={6}
                watchSlidesProgress
                breakpoints={{
                  640: { slidesPerView: 8 },
                  1024: { slidesPerView: 10 },
                }}
                className="thumbs-swiper"
              >
                {thumbnails.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div className="cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-primary hover:scale-105">
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-14 w-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Reveal>
                <h1 className="font-dosis text-4xl font-bold text-secondary dark:text-white md:text-5xl">
                  {data.title}
                </h1>
              </Reveal>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-2 font-edu text-secondary dark:text-white">
                <BsFillFileEarmarkBarGraphFill className="text-primary" />
                <span className="font-bold">{data.marks}</span> Marks
              </div>
              <div className="flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-2 font-edu text-secondary dark:text-white">
                <BsCalendarDateFill className="text-primary" />
                Due: {formatDate(data.dueDate || "")} at {data.dueTime || "23:59"}
              </div>
              <div className="flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-2 font-edu text-secondary dark:text-white">
                <BsPersonFill className="text-primary" />
                <span className="font-bold">{data.totalSubmissions || 0}</span> Submissions
              </div>
              <div className="flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-4 py-2 font-edu text-secondary dark:text-white">
                <FaStar className="text-yellow-500" />
                <span className="font-bold">{data.averageRating ? Number(data.averageRating).toFixed(1) : "N/A"}</span> Rating
              </div>
              <div className={`flex items-center gap-2 rounded-full border-2 ${difficultyStyles.border} bg-opacity-10 px-4 py-2 font-edu ${difficultyStyles.text}`}>
                <MdSchool />
                <span className="font-bold capitalize">{data.difficulty}</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="mb-4 font-dosis text-2xl font-bold text-secondary dark:text-white">
                Overview
                <span className="ml-1 text-primary">.</span>
              </h2>
              <p className="font-poppins leading-relaxed text-secondary/80 dark:text-white/80">
                {data.description}
              </p>
            </motion.div>

            {/* Content/Instructions */}
            {data.content && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <h2 className="mb-4 font-dosis text-2xl font-bold text-secondary dark:text-white">
                  Instructions
                  <span className="ml-1 text-primary">.</span>
                </h2>
                <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 dark:from-white/5">
                  <p className="whitespace-pre-wrap font-poppins leading-relaxed text-secondary/90 dark:text-white/90">
                    {data.content}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="sticky top-28 space-y-6"
            >
              {/* Action Card */}
              <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-white shadow-xl dark:border-white/10 dark:bg-secondary/50">
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 dark:from-primary/10 dark:to-transparent">
                  <h3 className="font-dosis text-xl font-bold text-secondary dark:text-white">
                    Ready to Start?
                  </h3>
                  <p className="mt-1 font-edu text-sm text-secondary/70 dark:text-white/70">
                    Take on this assignment and showcase your skills
                  </p>
                </div>
                <div className="space-y-3 p-6">
                  {isCreator ? (
                    <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4 text-center">
                      <p className="font-bold text-yellow-600 dark:text-yellow-400">You created this assignment</p>
                    </div>
                  ) : (
                    <>
                      <div onClick={() => (modalOpen ? close() : open())}>
                        <Button str="Take Assignment" shadow={true} />
                      </div>
                      <button
                        onClick={openReview}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 py-3 font-edu font-bold text-secondary transition-all hover:bg-primary/10 dark:text-white"
                      >
                        <FaStar className="text-yellow-500" />
                        Rate Assignment
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 py-3 font-edu font-bold text-secondary transition-all hover:bg-primary/10 disabled:opacity-50 dark:text-white"
                  >
                    <IoBookmark className="text-primary" />
                    {isAddingToWishlist ? "Adding..." : "Add to Wishlist"}
                  </button>
                </div>
              </div>

              {/* Author Card */}
              <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-white shadow-xl dark:border-white/10 dark:bg-secondary/50">
                <div className="p-6">
                  <h3 className="mb-4 font-dosis text-lg font-bold text-secondary dark:text-white">
                    Created By
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={data.createdBy?.profileImage || "https://via.placeholder.com/60"}
                      alt={data.createdBy?.name || "Author"}
                      className="h-14 w-14 rounded-full border-2 border-primary object-cover shadow-lg shadow-primary/30"
                    />
                    <div>
                      <p className="font-dosis font-bold text-secondary dark:text-white">
                        {data.createdBy?.name || "Unknown"}
                      </p>
                      <p className="font-edu text-sm text-secondary/60 dark:text-white/60">
                        {data.createdBy?.email || "N/A"}
                      </p>
                      {data.createdBy?.role && (
                        <span className="mt-1 inline-block rounded-full bg-primary/20 px-2 py-0.5 font-edu text-xs font-semibold capitalize text-primary">
                          {data.createdBy.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {data.createdAt && (
                <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-2 font-edu text-sm text-secondary/60 dark:text-white/60">
                    <MdAccessTime className="text-primary" />
                    <span>Published: {formatDate(data.createdAt)}</span>
                  </div>
                  {data.updatedAt && data.updatedAt !== data.createdAt && (
                    <div className="mt-1 flex items-center gap-2 font-edu text-sm text-secondary/60 dark:text-white/60">
                      <MdAccessTime className="text-primary" />
                      <span>Updated: {formatDate(data.updatedAt)}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence initial={false}>
        {modalOpen && <AnimatedModal handleClose={close} />}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {reviewModalOpen && <ReviewModal handleClose={closeReview} assignmentId={id!} />}
      </AnimatePresence>

      {/* Custom Swiper Styles */}
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #00ffa5;
          background: rgba(31, 39, 55, 0.8);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 255, 165, 0.9);
          color: #1f2937;
        }
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #00ffa5;
          opacity: 1;
          width: 24px;
          border-radius: 5px;
        }
        .thumbs-swiper .swiper-slide-thumb-active {
          border-color: #00ffa5 !important;
          border-width: 2px;
          border-radius: 12px;
        }
      `}</style>
    </motion.div>
  );
};

export default ViewDetails;
