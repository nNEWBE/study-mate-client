
import TextScramble from "../../animation/TextScramble";
import "../../styles/style.css";
import Card from "../common/Card";
import TextReveal from "../../animation/TextReveal";
import Reveal from "../../animation/Reveal";
import Unhidden from "../../animation/Unhidden";
import CardSkeleton from "../ui/CardSkeleton";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteAssignmentMutation, useGetAssignmentsQuery } from "../../redux/features/assignments/assignmentApi";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useModal } from "../ui/Modal";
import { getErrorMessage } from "../../utils/errorHandler";

const Features = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();
  const { data: assignments = [], isLoading } = useGetAssignmentsQuery();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const handleDelete = async (id: string, email: string, name: string) => {
    if (!user) {
      navigate("/account");
      return toast.error("Login to delete this assignment");
    } else if (user?.email !== email && user?.displayName !== name)
      return toast.error("Only author can delete assignment");

    showModal({
      type: "confirm",
      title: "Want to Delete?",
      message: "This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        try {
          await deleteAssignment(id).unwrap();
          toast.success("Assignment Deleted Successfully");
          showModal({
            type: "success",
            title: "Deleted Successfully",
            message: "The assignment has been removed.",
            confirmText: "Ok",
          });
        } catch (error) {
          console.log(error);
          toast.error(getErrorMessage(error, "Failed to delete assignment"));
        }
      },
    });
  };


  return (
    <div className="w-full bg-white pt-32 dark:bg-secondary">
      <div
        id="Features"
        className="max-w-[90rem] mx-auto w-[90%]"
      >
        <div className="flex justify-center">
          <Reveal>
            <TextScramble>Assignments Section</TextScramble>
          </Reveal>
        </div>

        <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
          <Unhidden>
            <TextReveal className="text-center">
              Stay organized by tracking assignment deadlines, setting reminders,
              and monitoring your teams progress.
            </TextReveal>
          </Unhidden>
        </div>

        <div className="responsive mx-2 mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {isLoading ? (
            <CardSkeleton cards={6} />
          ) : (
            assignments
              .slice(0, 6)
              .map((d, index) => (
                <Card handleDelete={handleDelete} d={d} key={index} />
              ))
          )}
        </div>

        <div className="relative mt-5 h-[15rem]">
          <div className="absolute top-16 flex w-full justify-center">
            <div className="z-10 mx-auto mt-2 w-[10rem]">
              <Link to={"/tasks"}>
                <Button str="View All" shadow={true} />
              </Link>
            </div>
          </div>

          <div className="absolute top-0 h-[15rem] w-full overflow-y-hidden opacity-30">
            <div className="responsive mx-2 mt-5 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {isLoading ? (
                <CardSkeleton cards={3} />
              ) : (
                assignments
                  .slice(0, 3)
                  .map((d, index) => (
                    <Card handleDelete={handleDelete} d={d} key={index} />
                  ))
              )}
            </div>
          </div>
          <div className="absolute top-0 z-[1] h-[15rem] w-full bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,.7)_50%,_rgba(255,255,255,1))] transition-colors duration-0 dark:bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(15,23,42,.7)_50%,_rgba(15,23,42,1))]"></div>
        </div>
      </div>
    </div>
  );
};

export default Features;
