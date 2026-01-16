import { useEffect } from "react";
import { useModal } from "./ui/Modal";

interface WelcomeData {
    name: string;
    provider?: string;
    isRegistration?: boolean;
}

const WelcomeModalHandler = (): null => {
    const { showModal } = useModal();

    useEffect(() => {
        // Check for welcome modal flag on mount (for page refresh scenarios)
        const welcomeData = localStorage.getItem('showWelcomeModal');

        if (welcomeData) {
            try {
                const data: WelcomeData = JSON.parse(welcomeData);
                localStorage.removeItem('showWelcomeModal');
                setTimeout(() => {
                    showModal({
                        type: "success",
                        title: data.isRegistration ? "SignUp Successful" : "Welcome Back!",
                        message: data.isRegistration
                            ? "Welcome to StudyMate!"
                            : `Signed in with ${data.provider}. Enjoy exploring Study Mate!`,
                        confirmText: "Let's Go!",
                    });
                }, 500);
            } catch (e) {
                console.error("Failed to parse welcome modal data:", e);
                localStorage.removeItem('showWelcomeModal');
            }
        }

        // Listen for custom event from AuthProvider
        const handleWelcomeEvent = (event: CustomEvent<WelcomeData>) => {
            const data = event.detail;
            setTimeout(() => {
                showModal({
                    type: "success",
                    title: data.isRegistration ? "SignUp Successful" : "Welcome Back!",
                    message: data.isRegistration
                        ? "Welcome to StudyMate!"
                        : `Signed in with ${data.provider}. Enjoy exploring Study Mate!`,
                    confirmText: "Let's Go!",
                });
            }, 500);
        };

        window.addEventListener('showWelcomeModal', handleWelcomeEvent as EventListener);

        return () => {
            window.removeEventListener('showWelcomeModal', handleWelcomeEvent as EventListener);
        };
    }, [showModal]);

    return null;
};

export default WelcomeModalHandler;
