import { useState } from "react";
import CardSkeleton from "../components/ui/CardSkeleton";
import Card from "../components/common/Card";
import Unhidden from "../animation/Unhidden";
import TextScramble from "../animation/TextScramble";
import Reveal from "../animation/Reveal";
import TextReveal from "../animation/TextReveal";
import { motion } from "framer-motion";
import CounterUp from "../animation/CounterUp";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useModal } from "../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { useGetAssignmentsQuery, useDeleteAssignmentMutation } from "../redux/features/assignments/assignmentApi";
import { getErrorMessage } from "../utils/errorHandler";

const Tasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();

  const { data: assignments = [], isLoading } = useGetAssignmentsQuery();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const handleDelete = async (id: string, email: string, name: string) => {
    console.log(id)
    if (!user) {
      navigate("/account")
      return toast.error("Login to delete this assignment")
    }
    else if (user?.email !== email && user?.displayName !== name)
      return toast.error("Only author can delete assignment")

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
        } catch (error: any) {
          console.log(error);
          toast.error(getErrorMessage(error, "Failed to delete assignment"));
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mx-auto w-[90%] bg-white py-32 dark:bg-secondary"
    >
      <div className="flex justify-center">
        <Reveal>
          <TextScramble>All Assignments</TextScramble>
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
          assignments.map((d, index) => (
            <Card handleDelete={handleDelete} d={d} key={index} />
          ))
        )}
      </div>

      <div className="mt-32 flex justify-center">
        <Reveal>
          <TextScramble>Progress Overview</TextScramble>
        </Reveal>
      </div>

      <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
        <Unhidden>
          <TextReveal className="text-center">
            See the total number of students, assignments created, submissions
            completed, and pending tasks in real-time.
          </TextReveal>
        </Unhidden>
      </div>

      <div className="mt-20">
        <CounterUp />
      </div>
    </motion.div>
  );
};

export default Tasks;
