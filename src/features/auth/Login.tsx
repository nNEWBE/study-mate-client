import "boxicons";
import Divider from "../../components/ui/Divider";
import auth from "../../config/firebase";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import PropTypes from "prop-types";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import "animate.css";
import toast from "react-hot-toast";
import { useToggle } from "../../context/ToggleProvider";
import { useLoginMutation, useRegisterMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/store";
import { setUser as setReduxUser } from "../../redux/features/auth/authSlice";
import GooglePasswordModal from "../../components/ui/GooglePasswordModal";
import { useModal } from "../../components/ui/Modal";

interface LoginInputs {
  email: string;
  password: string;
}

interface LoginProps {
  loginFormRef: React.RefObject<HTMLFormElement>;
}

interface GoogleUserInfo {
  name: string;
  email: string;
  photoURL: string;
  uid: string;
}

const Login = ({ loginFormRef }: LoginProps) => {
  const [see, setSee] = useState(false);
  const [checked, setChecked] = useState(true);
  const { showModal } = useModal();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState<GoogleUserInfo | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const { theme } = useToggle();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };
  const { signInWithGoogle, signInWithGithub, logoutUser, setUser } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit = async (data: LoginInputs) => {
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <span className="font-semibold">Signing in...</span>
      </div>,
      {
        style: {
          background: "#0f172a",
          color: "#00ffa5",
          border: "2px solid #00ffa5",
          boxShadow: "0 0 10px 2px rgba(0, 255, 165, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
        iconTheme: {
          primary: "#00ffa5",
          secondary: "#0f172a",
        },
      }
    );

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.dismiss(loadingToast);

      if (result.success && result.data) {
        dispatch(setReduxUser({
          user: {
            email: result.data.user?.email || data.email,
            uid: result.data.user?._id || null,
            displayName: result.data.user?.name || null,
            photoURL: result.data.user?.profileImage || null,
          },
          token: result.data.accessToken,
        }));

        navigate(location?.state ? location.state : "/");
        reset();
        // Show success modal
        setTimeout(() => {
          showModal({
            type: "success",
            title: "SignIn Successful",
            message: "Welcome back to StudyMate!",
            confirmText: "Continue",
          });
        }, 100);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message = error?.data?.message || "Login failed. Please try again.";
      toast.error(message, {
        style: {
          background: "#0f172a",
          color: "#ef4444",
          border: "2px solid #ef4444",
          boxShadow: "0 0 10px 2px rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
      });
    }
  };

  const handleGoogleLogin = async () => {
    sessionStorage.setItem("google_pending_password", "true");
    setIsSocialLoading(true);
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <span className="font-semibold">Connecting to Google...</span>
      </div>,
      {
        style: {
          background: "#0f172a",
          color: "#00ffa5",
          border: "2px solid #00ffa5",
          boxShadow: "0 0 10px 2px rgba(0, 255, 165, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
        iconTheme: {
          primary: "#00ffa5",
          secondary: "#0f172a",
        },
      }
    );

    try {
      const result = await signInWithGoogle();
      toast.dismiss(loadingToast);

      if (result?.user && result.user.email) {
        // Always show password modal for first-time or returning Google users
        // User must set a password to complete registration
        setGoogleUserInfo({
          name: result.user.displayName || "",
          email: result.user.email || "",
          photoURL: result.user.photoURL || "",
          uid: result.user.uid || "",
        });
        setIsGoogleModalOpen(true);
      }
    } catch (error: any) {
      sessionStorage.removeItem("google_pending_password");
      toast.dismiss(loadingToast);
      const message = error?.message || "Google login failed. Please try again.";
      toast.error(message, {
        style: {
          background: "#0f172a",
          color: "#ef4444",
          border: "2px solid #ef4444",
          boxShadow: "0 0 10px 2px rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleGooglePasswordSubmit = async (password: string) => {
    if (!googleUserInfo) return;

    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <span className="font-semibold">Authenticating...</span>
      </div>,
      {
        style: {
          background: "#0f172a",
          color: "#00ffa5",
          border: "2px solid #00ffa5",
          boxShadow: "0 0 10px 2px rgba(0, 255, 165, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
        iconTheme: {
          primary: "#00ffa5",
          secondary: "#0f172a",
        },
      }
    );

    try {
      // First, try to login with the email and password (for returning users)
      try {
        const loginResult = await login({
          email: googleUserInfo.email,
          password: password,
        }).unwrap();

        toast.dismiss(loadingToast);

        if (loginResult.success && loginResult.data) {
          dispatch(setReduxUser({
            user: {
              email: loginResult.data.user?.email || googleUserInfo.email,
              uid: loginResult.data.user?._id || null,
              displayName: loginResult.data.user?.name || googleUserInfo.name,
              photoURL: loginResult.data.user?.profileImage || googleUserInfo.photoURL,
            },
            token: loginResult.data.accessToken,
          }));

          sessionStorage.removeItem("google_pending_password");
          if (auth.currentUser) setUser(auth.currentUser);

          setIsGoogleModalOpen(false);
          setGoogleUserInfo(null);
          navigate(location?.state ? location.state : "/");

          // Show success modal for login
          setTimeout(() => {
            showModal({
              type: "success",
              title: "Welcome Back!",
              message: "You have been logged in successfully.",
              confirmText: "Continue",
            });
          }, 100);
          return;
        }
      } catch (loginError: any) {
        // Login failed - user doesn't exist, proceed with registration
        console.log("User not found, proceeding with registration...");
      }

      // If login failed, register the user
      const registerData = {
        name: googleUserInfo.name,
        email: googleUserInfo.email,
        password: password,
        profileImageUrl: googleUserInfo.photoURL || undefined,
        provider: "google" as const,
      };

      const result = await registerUser(registerData).unwrap();
      toast.dismiss(loadingToast);

      if (result.success && result.data) {
        dispatch(setReduxUser({
          user: {
            email: result.data.user?.email || googleUserInfo.email,
            uid: result.data.user?._id || null,
            displayName: result.data.user?.name || googleUserInfo.name,
            photoURL: result.data.user?.profileImage || googleUserInfo.photoURL,
          },
          token: result.data.accessToken,
        }));

        sessionStorage.removeItem("google_pending_password");
        if (auth.currentUser) setUser(auth.currentUser);

        setIsGoogleModalOpen(false);
        setGoogleUserInfo(null);
        navigate(location?.state ? location.state : "/");

        // Show success modal for registration
        setTimeout(() => {
          showModal({
            type: "success",
            title: "Account Created!",
            message: "Welcome to StudyMate! Your account has been created successfully.",
            confirmText: "Let's Go!",
          });
        }, 100);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message = error?.data?.message || "Authentication failed. Please try again.";
      toast.error(message, {
        style: {
          background: "#0f172a",
          color: "#ef4444",
          border: "2px solid #ef4444",
          boxShadow: "0 0 10px 2px rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
      });
    }
  };

  const handleGithubLogin = async () => {
    setIsSocialLoading(true);
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <span className="font-semibold">Connecting to GitHub...</span>
      </div>,
      {
        style: {
          background: "#0f172a",
          color: "#00ffa5",
          border: "2px solid #00ffa5",
          boxShadow: "0 0 10px 2px rgba(0, 255, 165, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
        iconTheme: {
          primary: "#00ffa5",
          secondary: "#0f172a",
        },
      }
    );

    try {
      await signInWithGithub();
      toast.dismiss(loadingToast);
      navigate(location?.state ? location.state : "/");
      toast.success("Login successful!", {
        style: {
          background: "#0f172a",
          color: "#00ffa5",
          border: "2px solid #00ffa5",
          boxShadow: "0 0 10px 2px rgba(0, 255, 165, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
        iconTheme: {
          primary: "#00ffa5",
          secondary: "#0f172a",
        },
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const e = error.message?.slice(9, error.message.length) || "GitHub login failed";
      toast.error(`${e}`, {
        style: {
          background: "#0f172a",
          color: "#ef4444",
          border: "2px solid #ef4444",
          boxShadow: "0 0 10px 2px rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
        },
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleSee = () => {
    setSee(!see);
  };

  const isFormDisabled = isLoading || isSocialLoading;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={loginFormRef}
        className="animate__animated animate__fadeInRight w-full font-poppins"
      >
        <p className="my-7 text-center font-poppins text-4xl font-bold text-secondary dark:text-white">
          Sign
          <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
            In
          </span>
        </p>

        <div className="relative">
          <input
            {...register("email", {
              required: {
                value: true,
                message: "Enter your email address",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="Email"
            disabled={isFormDisabled}
            className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />
          {errors.email ? (
            <div
              role="alert"
              className="flex h-[1.5rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
            >
              <MdError />
              <span>{errors.email?.message}</span>
            </div>
          ) : (
            <div className="h-[1.5rem]"></div>
          )}
          <div className="absolute right-4 top-3">
            <box-icon
              name="envelope"
              color={`${theme ? "white" : "black"}`}
            ></box-icon>
          </div>
        </div>

        <div className="relative">
          <input
            {...register("password", {
              required: {
                value: true,
                message: "Enter your password",
              },
              minLength: {
                value: 6,
                message: "Enter at least 6 characters",
              },
            })}
            type={see ? "text" : "password"}
            placeholder="Password"
            disabled={isFormDisabled}
            className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />
          {errors.password ? (
            <div
              role="alert"
              className="flex h-[1.5rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
            >
              <MdError />
              <span>{errors.password?.message}</span>
            </div>
          ) : (
            <div className="h-[1.5rem]"></div>
          )}
          <div
            onClick={handleSee}
            className="absolute right-4 top-3 cursor-pointer text-2xl text-secondary dark:text-white"
          >
            {see ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        <div className="checkbox-wrapper">
          <input
            onChange={onChange}
            checked={checked}
            type="checkbox"
            id="input"
            className="check-input"
            disabled={isFormDisabled}
          />
          <label htmlFor="input" className="checkbox">
            <svg viewBox="0 0 22 16" fill="none">
              <path d="M1 6.85L8.09677 14L21 1" />
            </svg>
          </label>
          <label
            htmlFor="input"
            className="ml-4 cursor-pointer text-base font-semibold text-secondary dark:text-white"
          >
            Remember Me
          </label>
        </div>

        <div className="mx-auto mt-3 w-full">
          <Button
            str={isLoading ? "Signing In..." : "Sign In"}
            shadow={true}
            disabled={isFormDisabled}
          />
        </div>

        {/* Divider */}
        <Divider orbSize="md" />

        <div className="mt-5 flex justify-center gap-3">
          <div
            onClick={!isSocialLoading ? handleGoogleLogin : undefined}
            className={`cursor-pointer rounded-[50%] border-2 border-primary bg-primary bg-opacity-25 px-[10px] py-2 pt-2.5 transition-all duration-300 hover:scale-110 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] ${isSocialLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <FaGoogle className="text-xl text-secondary dark:text-white" />
          </div>
          <div
            onClick={!isSocialLoading ? handleGithubLogin : undefined}
            className={`cursor-pointer rounded-[50%] border-2 border-primary bg-primary bg-opacity-25 px-2.5 py-1 pt-2 transition-all duration-300 hover:scale-110 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] ${isSocialLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <FaGithub className="text-xl text-secondary dark:text-white" />
          </div>
        </div>
      </form>

      {/* Google Password Modal */}
      <GooglePasswordModal
        isOpen={isGoogleModalOpen}
        onClose={() => {
          sessionStorage.removeItem("google_pending_password");
          setIsGoogleModalOpen(false);
          setGoogleUserInfo(null);
          logoutUser();
        }}
        onSubmit={handleGooglePasswordSubmit}
        isLoading={isRegisterLoading}
        userInfo={googleUserInfo}
      />
    </>
  );
};

export default Login;

Login.propTypes = {
  loginFormRef: PropTypes.object,
};
