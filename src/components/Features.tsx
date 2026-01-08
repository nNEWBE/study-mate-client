import { useEffect, useState } from "react";
import TextScramble from "../animation/TextScramble";
import "../styles/style.css";
import Card from "./Card";
import TextReveal from "../animation/TextReveal";
import Reveal from "../animation/Reveal";
import Unhidden from "../animation/Unhidden";
import CardSkeleton from "../animation/CardSkeleton";
import Button from "../animation/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Features = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const getData = async () => {
    const { data } = await axios(
      `${import.meta.env.VITE_API_URL}/assignments`,
    );
    setData(data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getData();
  }, [user]);

  const handleDelete = async (id, email, name) => {
    if (!user) {
      navigate("/account");
      return toast.error("Login to delete this assignment");
    } else if (user?.email !== email && user?.displayName !== name)
      return toast.error("Only author can delete assignment");

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
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/assignments.json");
  //       const data = await response.json();
  //       setData(data);
  //       setTimeout(() => {
  //         setIsLoading(false);
  //       }, 5000);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div
      id="Features"
      className="mx-auto w-[90%] bg-white pt-32 dark:bg-secondary"
    >
      <div className="flex justify-center">
        <Reveal>
          <TextScramble>Assignments Section</TextScramble>
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
          <CardSkeleton cards={6} />
        ) : (
          data
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
              data.slice(0, 3).map((d, index) => <Card d={d} key={index} />)
            )}
          </div>
        </div>
        <div className="absolute top-0 z-[1] h-[15rem] w-full bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,.7)_50%,_rgba(255,255,255,1))] transition-colors duration-0 dark:bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(15,23,42,.7)_50%,_rgba(15,23,42,1))]"></div>
      </div>
    </div>
  );
};

export default Features;
