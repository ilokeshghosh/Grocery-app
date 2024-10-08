import { useForm } from "react-hook-form";
import authentication from "../services/authentication";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const response = await authentication.login({ ...data });

      if (response) {
        const userData = response.data;

        if (userData) {
          console.log("user Data", userData);
          const localUserData = JSON.stringify(userData.user);
          localStorage.setItem("userData", localUserData);
          localStorage.setItem("token", userData.accessToken);
          dispatch(login({ userData }));
          navigate('/')
          
        }
      }
    } catch (error) {
      console.log("error is ", error);
    }
  }

  return (
    <div className=" h-screen w-full flex ">
      {/* left section */}
      <div
        className="w-[60%] h-full bg-green-500 hidden lg:flex justify-center items-center"
        // style={{fontFamily:'Poppins, sans-serif',}}
      >
        <img
          className="h-[60%] w-[60%] object-cover"
          src="https://ik.imagekit.io/8fgpvoiai/grocery-store/Mobile%20login-bro_U1KGX3Vx3.png?updatedAt=1719384148896"
          alt=""
        />
      </div>

      {/* right section */}
      <div
        className=" w-full lg:w-[40%] h-full flex flex-col justify-center items-center gap-4 "
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* title */}
        <h2 className="font-bold text-4xl text-green-500">Login 🔒</h2>

        {/* lower container */}
        <div className="h-[50%] lg:h-[70%] w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full w-[70%] mx-auto  gap-4"
          >
            {/* Email input container */}
            <div className="flex flex-col">
              <label className="font-normal" htmlFor="email">
                Email
              </label>
              <input
                className="outline-none p-2 border-2 rounded border-green-500 h-10"
                type="email"
                name="email"
                id="email"
                {...register("email", { required: true })}
              />
            </div>

            {/* password input container */}
            <div className="flex flex-col">
              <label
                className="focus:font-bold font-normal selection:font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="outline-none p-2 border-2 rounded border-green-500 h-10"
                type="password"
                name="password"
                id="password"
                {...register("password", { required: true })}
              />
            </div>

            {/* button section */}
            <div className="flex flex-col w-full mt-8 gap-2">
              <a
                className="hover:text-green-500 ease-linear transition-all duration-400 text-end"
                href="/signup"
              >
                Create Account
              </a>
              {/* submit button */}
              <button
                className=" bg-green-500 rounded h-10 font-bold text-white text-xl duration-500 ease-linear transition-all hover:bg-white hover:border-2 hover:border-green-500 hover:text-black "
                type="submit"
              >
                Login 🔓
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
