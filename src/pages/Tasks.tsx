import { useEffect, useState } from "react";
import CardSkeleton from "../components/ui/CardSkeleton";
import Card from "../components/common/Card";
import Unhidden from "../animation/Unhidden";
import TextScramble from "../animation/TextScramble";
import Reveal from "../animation/Reveal";
import TextReveal from "../animation/TextReveal";
import { motion } from "framer-motion";
import CounterUp from "../animation/CounterUp";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const getData = async () => {
    const { data } = await axios(`${import.meta.env.VITE_API_URL}/assignments`);
    setData(data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getData();
  }, [user]);

  // const handleDelete = (id) => {
  //   console.log("Delete button clicked", id);

  //   try {
  //     Swal.fire({
  //       title: "Want to Delete?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       iconColor: "#3085d6",
  //       confirmButtonText: "Yes, Delete",
  //       background: "#111827",
  //       buttonsStyling: false,
  //       color: "#FFFFFF",
  //       customClass: {
  //         confirmButton:
  //           "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#3085d6] hover:text-[#3085d6] border-[4.5px] border-[#3085d6] text-[#3085d6] text-2xl font-bold font-edu px-5",
  //         cancelButton:
  //           "btn ml-5 animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#ef4444] hover:text-[#ef4444] border-[4.5px] border-[#ef4444] text-[#ef4444] text-2xl font-bold font-edu px-5",
  //         title: "font-poppins",
  //       },
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         const { data } = axios.delete(
  //           `${import.meta.env.VITE_API_URL}/assignment/${id}`,
  //         );
  //         getData();
  //         console.log(data);
  //         toast.success("Assignment Deleted Successfully");

  //         Swal.fire({
  //           title: "Deleted Successful",
  //           icon: "success",
  //           confirmButtonText: "Ok",
  //           iconColor: "#00ffa5",
  //           background: "#111827",
  //           buttonsStyling: false,
  //           color: "#FFFFFF",
  //           customClass: {
  //             confirmButton:
  //               "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#00ffa5] hover:text-[#00ffa5] border-[4.5px] border-[#00ffa5] text-[#00ffa5] text-2xl font-bold font-edu px-5",
  //             title: "font-poppins",
  //           },
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  const handleDelete = async (id: string, email: string, name: string) => {
    console.log(id)
    if (!user) {
      navigate("/account")
      return toast.error("Login to delete this assignment")
    }
    else if (user?.email !== email && user?.displayName !== name)
      return toast.error("Only author can delete assignment")

    try {
      const result = await Swal.fire({
        title: "Want to Delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        iconColor: "#3085d6",
        confirmButtonText: "Yes, Delete",
        background: "#111827",
        buttonsStyling: false,
        color: "#FFFFFF",
        customClass: {
          confirmButton:
            "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#3085d6] hover:text-[#3085d6] border-[4.5px] border-[#3085d6] text-[#3085d6] text-2xl font-bold font-edu px-5",
          cancelButton:
            "btn ml-5 animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#ef4444] hover:text-[#ef4444] border-[4.5px] border-[#ef4444] text-[#ef4444] text-2xl font-bold font-edu px-5",
          title: "font-poppins",
        },
      });

      if (result.isConfirmed) {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_API_URL}/assignment/${id}`,
        );

        getData();
        console.log(data);

        toast.success("Assignment Deleted Successfully");

        Swal.fire({
          title: "Deleted Successful",
          icon: "success",
          confirmButtonText: "Ok",
          iconColor: "#00ffa5",
          background: "#111827",
          buttonsStyling: false,
          color: "#FFFFFF",
          customClass: {
            confirmButton:
              "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#00ffa5] hover:text-[#00ffa5] border-[4.5px] border-[#00ffa5] text-[#00ffa5] text-2xl font-bold font-edu px-5",
            title: "font-poppins",
          },
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ translateX: "100%" }}
      animate={{
        translateX: "0%",
      }}
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
          <TextReveal>
            Stay organized by tracking assignment deadlines, setting reminders,
            and monitoring your teams progress.
          </TextReveal>
        </Unhidden>
      </div>

      <div className="responsive mx-2 mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {isLoading ? (
          <CardSkeleton cards={data?.length} />
        ) : (
          data.map((d, index) => (
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
          <TextReveal>
            See the total number of students, assignments created, submissions
            completed, and pending tasks in real-time.
          </TextReveal>
        </Unhidden>
      </div>

      <CounterUp />
    </motion.div>
  );
};

export default Tasks;
