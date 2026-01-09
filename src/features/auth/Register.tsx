import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import { FiEyeOff } from "react-icons/fi";
import PropTypes from "prop-types";
import { FiEye } from "react-icons/fi";
import { MdError } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useToggle } from "../../context/ToggleProvider";

interface RegisterInputs {
  name: string;
  email: string;
  photo: string;
  password: string;
}

interface RegisterProps {
  registerFormRef: React.RefObject<HTMLFormElement>;
}

const Register = ({ registerFormRef }: RegisterProps) => {
  const [see, setSee] = useState(false);
  const { theme } = useToggle();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, createUser, updateUserProfile, setUser } = useAuth();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const onSubmit = async (data: RegisterInputs) => {
    const email = data.email;
    const password = data.password;
    const name = data.name;
    const image = data.photo;

    try {
      const result = await createUser(email, password);
      await updateUserProfile(name, image);
      if (result.user) {
        setUser({ ...result.user, photoURL: image, displayName: name, email: email });
      }
      navigate(location?.state ? location.state : "/");
      reset();
      Swal.fire({
        title: "SignUp Successful",
        icon: "success",
        confirmButtonText: "Save",
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
    } catch (error: any) {
      const e = error.message.slice(9, error.message.length);
      toast.error(`${e}`);
    }
  };

  const handleSee = () => {
    setSee(!see);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={registerFormRef}
      className="hidden translate-x-[100%] font-poppins"
    >
      <p className="my-7 text-center font-poppins text-4xl font-bold text-secondary dark:text-white">
        Sign
        <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
          Up
        </span>
      </p>

      <div className="relative">
        <input
          {...register("name", {
            required: {
              value: true,
              message: "Enter your name",
            },
            minLength: {
              value: 3,
              message: "Enter at least 3 characters",
            },
            pattern: {
              value: /[A-Z]/,
              message: "Enter an uppercase letter",
            },
          })}
          type="text"
          placeholder="Username"
          className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
        />
        {errors.name ? (
          <div
            role="alert"
            className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
          >
            <MdError />
            <span>{errors.name?.message}</span>
          </div>
        ) : (
          <div className="h-[1.5rem]"></div>
        )}
        <div className="absolute right-4 top-3">
          <box-icon
            name="user"
            color={`${theme ? "white" : "black"}`}
          ></box-icon>
        </div>
      </div>

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
          className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
        />
        {errors.email ? (
          <div
            role="alert"
            className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
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
            <span>{errors.photo?.message}</span>
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
            pattern: {
              value: /[A-Z]/,
              message: "Enter an uppercase letter",
            },
            validate: (value) => {
              if (/[a-z]/.test(value)) {
                return true;
              }
              return "Enter an lowercase letter";
            },
          })}
          type={see ? "text" : "password"}
          placeholder="Password"
          className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
        />
        {errors.password ? (
          <div
            role="alert"
            className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
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

      <div className="mx-auto mt-2 sm:w-full">
        <Button str={"Sign Up"} shadow={true}></Button>
      </div>
    </form>
  );
};

export default Register;

Register.propTypes = {
  registerFormRef: PropTypes.object,
};
