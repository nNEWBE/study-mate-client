import toast from "react-hot-toast";
import axios from "axios";
import Reveal from "../animation/Reveal";
import Button from "../animation/Button";
import Unhidden from "../animation/Unhidden";
import TextReveal from "../animation/TextReveal";
import TextScramble from "../animation/TextScramble";
import { motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { ToggleContext } from "../context/ToggleProvider";
import { useContext, useState } from "react";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useLoaderData, useNavigate } from "react-router-dom";

const UpdateAssignment = () => {
   const {_id,title,photoURL,description,marks,difficulty,person,date:d} = useLoaderData();

   const formatToFullDate = (dateString) => {
     const [year, month, day] = dateString.split("/");
     const date = new Date(`${year}-${month}-${day}`); 

     return date;
   };

   const fullDate = formatToFullDate(d);
   const [date, setDate] = useState(fullDate);
   const navigate = useNavigate();
   const { theme } = useContext(ToggleContext);
   const [selectedDifficulty, setSelectedDifficulty] = useState({
     name: difficulty,
   });

   console.log(selectedDifficulty.name)
   
   const difficulties = [
     { name: "Easy"},
     { name: "Medium" },
     { name: "Hard" },
   ];

   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm();

   const onSubmit = async (data) => {
     const title = data.title;
     const photoURL = data.photo;
     const marks = data.marks;
     const description = data.description;

     const assignmentData = {
       title,
       photoURL,
       marks,
       date: date.toLocaleDateString("en-US"),
       description,
       difficulty: selectedDifficulty?.name,
       person: {
         email: person?.email,
         name: person?.name,
         photo: person?.photo,
       },
     };
     console.log("🚀 ~ onSubmit ~ updateAssignment:", assignmentData);

     try {
       const { data } = await axios.put(
         `${import.meta.env.VITE_API_URL}/assignment/${_id}`,
         assignmentData,
       );
       console.log(data);
       toast.success("Assignment updated successfully!");
       navigate("/tasks");
     } catch (err) {
       console.log(err);
       toast.error(err.message);
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
           <TextScramble>Update Assigment</TextScramble>
         </Reveal>
       </div>

       <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
         <Unhidden>
           <TextReveal>
             Update assignments seamlessly on the platform for efficient online
             study management and enhanced student engagement.
           </TextReveal>
         </Unhidden>
       </div>

       <form
         onSubmit={handleSubmit(onSubmit)}
         className="mx-auto mt-10 flex flex-col items-center overflow-hidden rounded-3xl border-2 border-primary bg-primary bg-opacity-10 p-10 shadow-2xl backdrop-blur-[20px] backdrop-filter dark:border-white dark:border-opacity-[0.3] dark:bg-transparent sm:w-full lg:w-[50rem]"
       >
         <p className="mb-16 text-center font-poppins text-4xl font-bold text-secondary dark:text-white sm:mb-10">
           Update
           <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
             Now
           </span>
         </p>

         <div className="flex flex-col gap-0 md:flex-row md:gap-5 lg:gap-10">
           <div className="relative w-[16.6rem] sm:w-[20rem]">
             <input
               {...register("title", {
                 required: {
                   value: true,
                   message: "Enter assignment title",
                 },
               })}
               defaultValue={title}
               type="text"
               placeholder="Title"
               className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
             />
             {errors.title ? (
               <div
                 role="alert"
                 className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
               >
                 <MdError />
                 <span>{errors.title.message}</span>
               </div>
             ) : (
               <div className="h-[1.5rem]"></div>
             )}
             <div className="absolute right-4 top-3">
               <box-icon
                 name="text"
                 color={`${theme ? "white" : "black"}`}
               ></box-icon>
             </div>
           </div>

           <div className="relative w-[16.6rem] sm:w-[20rem]">
             <input
               disabled
               defaultValue={person.email}
               type="email"
               placeholder="Email"
               className="mx-auto w-[16.6rem] cursor-not-allowed select-none rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
             />
             <div className="h-[1.5rem]"></div>
             <div className="absolute right-4 top-3">
               <box-icon
                 name="envelope"
                 color={`${theme ? "white" : "black"}`}
               ></box-icon>
             </div>
           </div>
         </div>

         <div className="flex flex-col gap-0 md:flex-row md:gap-5 lg:gap-10">
           <div className="mb-[1.5rem]">
             <Calendar
               id="buttondisplay"
               value={date}
               onChange={(e) => setDate(e.value)}
               placeholder={date}
               dateFormat="yy/mm/dd"
               showIcon
             />
           </div>

           <div className="mb-[1.5rem]">
             <Dropdown
               inputId="dd-city"
               value={selectedDifficulty}
               onChange={(e) => setSelectedDifficulty(e.value)}
               options={difficulties}
               optionLabel="name"
               className="w-full"
               placeholder="Difficulty"
             />
           </div>
         </div>

         <div className="flex flex-col gap-0 md:flex-row md:gap-5 lg:gap-10">
           <div className="relative">
             <input
               {...register("photo", {
                 required: {
                   value: true,
                   message: "Enter your photo url",
                 },
                 pattern: {
                   value: /^(ftp|http|https):\/\/[^ "]+$/,
                   message: "Enter a valid url",
                 },
               })}
               defaultValue={photoURL}
               type="text"
               placeholder="Photo Url"
               className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
             />
             {errors.photo ? (
               <div
                 role="alert"
                 className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
               >
                 <MdError />
                 <span>{errors.photo.message}</span>
               </div>
             ) : (
               <div className="h-[1.5rem]"></div>
             )}

             <div className="absolute right-4 top-3">
               <box-icon
                 name="link-alt"
                 color={`${theme ? "white" : "black"}`}
               ></box-icon>
             </div>
           </div>

           <div className="relative w-[16.6rem] sm:w-[20rem]">
             <input
               {...register("marks", {
                 required: {
                   value: true,
                   message: "Enter assignment marks",
                 },
                 pattern: {
                   value: /^\d+$/,
                   message: "Enter numbers only",
                 },
               })}
               defaultValue={marks}
               type="text"
               placeholder="Marks"
               className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
             />
             {errors.marks ? (
               <div
                 role="alert"
                 className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
               >
                 <MdError />
                 <span>{errors.marks.message}</span>
               </div>
             ) : (
               <div className="h-[1.5rem]"></div>
             )}
             <div className="absolute right-4 top-3">
               <HiOutlineDocumentChartBar
                 strokeWidth="1.9"
                 className="text-[25px] text-secondary dark:text-white"
               />
             </div>
           </div>
         </div>

         <div className="relative h-full">
           <textarea
             {...register("description", {
               required: {
                 value: true,
                 message: "Enter assigment description",
               },
             })}
             defaultValue={description}
             type="text"
             className="mx-auto w-[16.5rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem] md:w-[41.3rem] lg:w-[42.5rem]"
             placeholder="Description"
           ></textarea>
           {errors.description ? (
             <div
               role="alert"
               className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
             >
               <MdError />
               <span>{errors.description.message}</span>
             </div>
           ) : (
             <div className="h-[1.5rem]"></div>
           )}
           <div className="absolute right-4 top-3">
             <box-icon
               name="comment-dots"
               color={`${theme ? "white" : "black"}`}
             ></box-icon>
           </div>
         </div>

         <div className="mt-3 flex w-[43.5rem] justify-center px-5 md:justify-end lg:w-full">
           <div className="w-[16rem] sm:w-[20rem]">
             <Button str={"Submit"} shadow={true}></Button>
           </div>
         </div>
       </form>
     </motion.div>
   );
};

export default UpdateAssignment;