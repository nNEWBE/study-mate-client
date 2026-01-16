
import { useState } from "react";
import Unhidden from "../animation/Unhidden";
import TextScramble from "../animation/TextScramble";
import Reveal from "../animation/Reveal";
import TextReveal from "../animation/TextReveal";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom";
import { BsFillFileEarmarkBarGraphFill, BsFillFileEarmarkTextFill } from "react-icons/bs";
import Button from "../components/ui/Button";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "../redux/features/wishlist/wishlistApi";
import { getErrorMessage } from "../utils/errorHandler";

const Wishlist = () => {
    const { user } = useAuth();
    const { data: wishlist = [], isLoading } = useGetWishlistQuery(undefined, { skip: !user });
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const handleRemove = async (id: string) => {
        try {
            await removeFromWishlist(id).unwrap();
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error removing", error);
            toast.error(getErrorMessage(error, "Failed to remove from wishlist"));
        }
    };

    return (
        <motion.div
            initial={{ translateX: "100%" }}
            animate={{ translateX: "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mx-auto w-[90%] bg-white py-32 dark:bg-secondary"
        >
            <div className="flex justify-center">
                <Reveal>
                    <TextScramble>My Wishlist</TextScramble>
                </Reveal>
            </div>

            <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
                <Unhidden>
                    <TextReveal className="text-center">
                        Assignments you have saved to work on later.
                    </TextReveal>
                </Unhidden>
            </div>

            <div className="responsive mx-2 mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-3 text-center text-gray-400">Loading...</div>
                ) : wishlist.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500">Your wishlist is empty.</div>
                ) : (
                    wishlist.map((item) => (
                        <div key={item._id}>
                            <Tilt
                                glareEnable={false}
                                tiltMaxAngleY={5}
                                tiltMaxAngleX={5}
                                glareBorderRadius="10px"
                                className="flex flex-col justify-between rounded-2xl border-2 border-secondary bg-transparent px-2.5 py-1 pt-2 shadow-[0px_0px_5px_2px] shadow-primary backdrop-blur-[20px]"
                            >
                                <div className="threeD-effect relative m-4 h-[190px] overflow-hidden rounded-2xl shadow-[0px_0px_15px_2px] shadow-primary">
                                    <Link to={`/assignment/${item.assignment._id}`} className="card-view-link" data-cursor="card">
                                        <img
                                            className="h-[190px] w-full scale-[1.01] rounded-2xl object-cover shadow-xl transition-all duration-1000 hover:scale-110"
                                            src={item.assignment.thumbnailUrl?.[0] || item.assignment.photoURL || item.assignment.thumbnail}
                                            alt={item.assignment.title}
                                        />
                                    </Link>
                                    <div className="absolute right-3 top-3 text-sm font-bold">
                                        <div className="border-rotate flex h-[2rem] w-[5rem] items-center justify-center bg-white font-edu text-primary dark:bg-secondary">
                                            <p style={{ filter: " drop-shadow(1px 1px 1px var(--secondary))" }}>
                                                {item.assignment.difficulty}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="m-4 mt-5">
                                    <h1 className="font-dosis text-2xl font-bold text-secondary dark:text-white">
                                        {item.assignment.title} <span className="text-4xl font-bold text-primary">.</span>
                                    </h1>
                                    <div className="mt-5 font-edu font-medium text-secondary dark:text-white">
                                        <div className="mt-5">
                                            <BsFillFileEarmarkTextFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
                                            <p className="inline text-base">
                                                <span style={{ filter: " drop-shadow(1px 1px 1px var(--secondary))" }} className="text-primary">
                                                    About :{" "}
                                                </span>{" "}
                                                {item.assignment.description.substring(0, 50)}...
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between font-edu font-medium text-secondary dark:text-white">
                                        <div>
                                            <BsFillFileEarmarkBarGraphFill className="relative bottom-[3px] mr-2 inline rounded-lg border-2 border-secondary bg-white p-[4px] text-[1.5rem] text-secondary shadow-[0_0_5px_2px] shadow-primary" />
                                            <p className="inline text-base">
                                                <span style={{ filter: " drop-shadow(1px 1px 1px var(--secondary))" }} className="text-primary">
                                                    Marks :{" "}
                                                </span>{" "}
                                                {item.assignment.marks}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-7 flex items-center justify-center">
                                        <div onClick={() => handleRemove(item._id)} className="w-[8rem]">
                                            <Button str="Remove" shadow={true} />
                                        </div>
                                    </div>
                                </div>
                            </Tilt>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};
export default Wishlist;
