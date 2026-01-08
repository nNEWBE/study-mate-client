import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const TopLoadingBar = (): JSX.Element => {
    const { pathname } = useLocation();
    const controls = useAnimation();
    const [key, setKey] = useState(0);

    useEffect(() => {
        // Increment key to force re-render and restart animation on route change
        setKey(prev => prev + 1);

        const animate = async () => {
            // 1. Reset instantly
            await controls.set({ width: "0%", opacity: 1 });

            // 2. Start loading
            await controls.start({
                width: "70%",
                transition: { duration: 0.8, ease: "easeInOut" }
            });

            // 3. Finish
            await controls.start({
                width: "100%",
                transition: { duration: 0.3, ease: "easeOut" }
            });

            // 4. Fade out
            await controls.start({
                opacity: 0,
                transition: { duration: 0.2, delay: 0.1 }
            });
        };

        animate();
    }, [pathname, controls]);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100000] pointer-events-none h-[3px]">
            <motion.div
                key={key}
                animate={controls}
                initial={{ width: "0%", opacity: 1 }}
                className="h-full bg-primary shadow-[0_0_10px_#00ffa5]"
                style={{
                    background: "#00ffa5",
                    boxShadow: "0 0 10px #00ffa5, 0 0 5px #00ffa5"
                }}
            />
        </div>
    );
};

export default TopLoadingBar;
