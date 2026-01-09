import Lottie from "lottie-react";
import { useRef, useEffect, useState } from "react";

interface LottieFilesProps {
  animation: object;
  className?: string;
}

const LottieFiles = ({ animation, className }: LottieFilesProps): JSX.Element => {
  const lottieRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only play animation when visible in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (lottieRef.current) {
          if (entry.isIntersecting) {
            lottieRef.current.play();
          } else {
            lottieRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animation}
        loop={true}
        autoplay={isVisible}
        className={className}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
};

export default LottieFiles;
