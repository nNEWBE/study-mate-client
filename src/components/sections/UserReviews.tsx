import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import "../../styles/swiper-custom.css";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import Button from "../ui/Button";
import Reveal from "../../animation/Reveal";
import TextScramble from "../../animation/TextScramble";
import Unhidden from "../../animation/Unhidden";
import TextReveal from "../../animation/TextReveal";

const reviews = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "Computer Science Student",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        review: "Study Mate has completely transformed how I manage my assignments. The interface is intuitive and the tracking features are a lifesaver!",
    },
    {
        id: 2,
        name: "Sarah Williams",
        role: "High School Senior",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4,
        review: "I love the collaborative aspects. Being able to share resources with my study group so easily makes group projects much less stressful.",
    },
    {
        id: 3,
        name: "David Chen",
        role: "University Student",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 5,
        review: "The design is beautiful and motivating. It feels like a premium app. Highly recommended for any student looking to get organized.",
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Online Learner",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        review: "Finally an app that understands what students actually need. The 'Find Partners' feature helped me connect with like-minded peers.",
    },
    {
        id: 5,
        name: "Michael Brown",
        role: "College Freshman",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        rating: 4,
        review: "Great platform! It works smoothly on my phone and laptop. I just wish there were more dark mode themes, but the current one is sleek.",
    },
];

const UserReviews = () => {

    return (
        <div className="w-full bg-white pt-40 pb-20 dark:bg-secondary">
            <div className="mx-auto w-[90%] max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content Section */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">

                        <div className="mb-6">
                            <Reveal>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-dosis text-secondary dark:text-white leading-tight mb-6">
                                    <TextScramble as="span">What Our Users Say</TextScramble>
                                </h2>
                            </Reveal>
                            <Unhidden>
                                <div className="text-gray-600 dark:text-gray-300 font-poppins text-base md:text-lg leading-relaxed max-w-xl">
                                    <TextReveal className="text-left">
                                        Discover how Study Mate is empowering students worldwide.
                                        From boosting productivity to fostering collaboration,
                                        hear directly from our community about their journey to academic excellence.
                                        Join thousands of successful learners today.
                                    </TextReveal>
                                </div>
                            </Unhidden>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-8"
                        >
                            <div>
                                <Button str="Give a Review" shadow={true} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Swiper Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 flex justify-center lg:justify-end"
                    >
                        <Swiper
                            effect={"cards"}
                            grabCursor={true}
                            modules={[EffectCards, Pagination, Autoplay]}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            className="w-[300px] sm:w-[400px] md:w-[450px] !overflow-visible"
                        >
                            {reviews.map((review) => (
                                <SwiperSlide key={review.id} className="rounded-3xl">
                                    <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-secondary bg-white dark:bg-secondary p-8 text-center shadow-[0px_0px_5px_2px] shadow-primary h-[450px]">


                                        <div className="absolute -top-5 -left-5 flex items-center justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-50"></div>
                                                <div className="relative h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-lg shadow-primary/40 border-2 border-white dark:border-secondary">
                                                    <FaQuoteLeft size={22} className="text-secondary" />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="relative mb-6">
                                            <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-secondary border-2 border-white 
                                            dark:border-secondary dark:ring-offset-secondary shadow-primary shadow-[0px_0px_5px_5px]">
                                                <img
                                                    src={review.image}
                                                    alt={review.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-primary text-secondary text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                                {review.rating}.0
                                            </div>
                                        </div>

                                        <h3 className="mb-1 font-dosis text-2xl font-bold text-secondary dark:text-white">
                                            {review.name}
                                        </h3>
                                        <p className="mb-4 font-poppins text-xs font-medium uppercase tracking-wide text-primary">
                                            {review.role}
                                        </p>

                                        <div className="mb-6 flex gap-1 justify-center">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={
                                                        i < review.rating
                                                            ? "text-yellow-400 drop-shadow-sm"
                                                            : "text-gray-300 dark:text-gray-600"
                                                    }
                                                    size={18}
                                                />
                                            ))}
                                        </div>

                                        <p className="font-edu text-sm md:text-base font-medium text-gray-600 dark:text-gray-300 italic line-clamp-4 leading-relaxed">
                                            "{review.review}"
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserReviews;
