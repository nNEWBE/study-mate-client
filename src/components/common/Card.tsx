import { BsFillFileEarmarkBarGraphFill, BsCalendarDate, BsClock, BsPeopleFill } from "react-icons/bs";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { FaStar, FaRegStar } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import Button from "../ui/Button";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useToggle } from "../../context/ToggleProvider";
import "../../styles/style.css";
import { Link } from "react-router-dom";
import { Assignment } from "../../types";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useAddToWishlistMutation } from "../../redux/features/wishlist/wishlistApi";
import { useToggleBestAssignmentMutation } from "../../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../../utils/errorHandler";
import { useAppSelector } from "../../redux/store";

interface CardProps {
  d: Assignment;
}

const Card = ({ d }: CardProps): JSX.Element => {
  const { theme } = useToggle();
  const { user: authUser } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [toggleBestAssignment, { isLoading: isTogglingBest }] = useToggleBestAssignmentMutation();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isAdmin = user?.role === 'admin';

  // Handle toggle best assignment
  const handleToggleBest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleBestAssignment({ id: d._id, isBest: !d.isBestAssignment }).unwrap();
      toast.success(d.isBestAssignment ? "Removed from Best Assignments" : "Marked as Best Assignment");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authUser) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      await addToWishlist({ assignment: d._id }).unwrap();
      setIsWishlisted(true);
      toast.success("Added to Wishlist!");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to add to wishlist"));
    }
  };

  // Format due date and time
  const formatDueDateTime = () => {
    if (!d.dueDate) return "N/A";
    const date = new Date(d.dueDate);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeStr = d.dueTime || "23:59";
    return `${dateStr} at ${timeStr}`;
  };

  // Check if assignment is expired
  const isExpired = d.isExpired || false;

  const thumbnail = d.thumbnailUrl?.[0] || d.photoURL || d.thumbnail || "https://placehold.co/600x400/1f2937/00ffa5?text=Assignment";

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
              src={thumbnail}
              alt={d.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/600x400/1f2937/00ffa5?text=Assignment";
              }}
            />
          </Link>

          {/* Difficulty Badge */}
          <div className="absolute right-3 top-3 text-sm font-bold">
            <div className="border-rotate flex h-[2rem] w-[5rem] items-center justify-center bg-white font-edu text-primary dark:bg-secondary">
              <p style={{ filter: "drop-shadow(1px 1px 1px var(--secondary))" }}>
                {d.difficulty}
              </p>
            </div>
          </div>

          {/* Best Assignment Badge */}
          {d.isBestAssignment && (
            <div className="absolute left-3 top-3">
              <div className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 font-dosis text-xs font-bold text-secondary shadow-lg">
                <FaStar className="text-secondary" />
                Best
              </div>
            </div>
          )}

          {/* Expired/Active Badge */}
          <div className="absolute left-3 bottom-3">
            <div className={`rounded-full px-2 py-1 font-dosis text-xs font-bold text-white ${isExpired ? "bg-red-500" : "bg-green-500"}`}>
              {isExpired ? "Expired" : "Active"}
            </div>
          </div>
        </div>

        <div className="m-4 mt-3">
          <h1 className="font-dosis text-2xl font-bold text-secondary dark:text-white line-clamp-1">
            {d.title} <span className="text-4xl font-bold text-primary">.</span>
          </h1>

          {/* Description */}
          <div className="mt-3 font-edu font-medium text-secondary dark:text-white">
            <div>
              <BsFillFileEarmarkTextFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
              <p className="inline text-sm line-clamp-2">
                <span style={{ filter: "drop-shadow(1px 1px 1px var(--secondary))" }} className="text-primary">
                  About:{" "}
                </span>
                {d.description}
              </p>
            </div>
          </div>

          {/* Info Row */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* Marks */}
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-2 py-1.5">
              <BsFillFileEarmarkBarGraphFill className="text-primary" />
              <span className="font-edu text-xs text-secondary dark:text-white">
                <span className="font-semibold text-primary">{d.marks}</span> marks
              </span>
            </div>

            {/* Submissions Count */}
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-2 py-1.5">
              <BsPeopleFill className="text-primary" />
              <span className="font-edu text-xs text-secondary dark:text-white">
                <span className="font-semibold text-primary">{d.totalSubmissions || 0}</span> submitted
              </span>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1.5">
            <BsClock className={`text-sm ${isExpired ? "text-red-500" : "text-primary"}`} />
            <span className={`font-edu text-xs ${isExpired ? "text-red-500" : "text-secondary dark:text-white"}`}>
              Due: {formatDueDateTime()}
            </span>
          </div>

          {/* Actions Row */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex-1 flex gap-2">
              <Link to={`assignment/${d._id}`}>
                <Button str="View Details" shadow={true} />
              </Link>

              {/* Admin Toggle Best Button */}
              {isAdmin && (
                <button
                  onClick={handleToggleBest}
                  disabled={isTogglingBest}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${d.isBestAssignment
                      ? "border-yellow-500 bg-yellow-500 text-secondary"
                      : "border-secondary bg-white text-secondary shadow-[0px_0px_5px_2px] shadow-primary hover:bg-yellow-500 hover:text-secondary dark:bg-secondary dark:text-white"
                    }`}
                  title={d.isBestAssignment ? "Remove from Best" : "Mark as Best"}
                >
                  {d.isBestAssignment ? <FaStar /> : <FaRegStar />}
                </button>
              )}
            </div>
            {/* Wishlist Button */}
            <button
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist || isWishlisted}
              className={`ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${isWishlisted
                ? "border-primary bg-primary text-secondary"
                : "border-secondary bg-white text-secondary shadow-[0px_0px_5px_2px] shadow-primary hover:bg-primary hover:text-secondary dark:bg-secondary dark:text-white"
                } disabled:cursor-not-allowed`}
            >
              {isWishlisted ? (
                <IoBookmark className="text-lg" />
              ) : (
                <IoBookmarkOutline className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </Tilt>
    </div>
  );
};

export default Card;
