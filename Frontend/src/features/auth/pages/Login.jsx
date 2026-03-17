import { useRef, useState } from "react";
import gsap from "gsap";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../hooks/useAuth";

gsap.registerPlugin(useGSAP);

const Login = () => {
  //GSAP FUNTIONS
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const loadingRef = useRef(null);
  const buttonRef = useRef(null);
  const { loading, handleLogin } = useAuth();


  useGSAP(
    () => {
      if (!cardRef.current || !buttonRef.current) return;

      gsap.from(cardRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.45,
        ease: "power2.out",
      });

      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.35,
        delay: 0.15,
        ease: "power2.out",
      });
    },
    { scope: rootRef, dependencies: [loading] }
  );
  useGSAP(
    () => {
      if (!loadingRef.current) return;

      gsap.to(loadingRef.current, {
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        duration: 1,
      });
    },
    { dependencies: [loading] }
  );
  const onButtonClick = () => {
    gsap.killTweensOf(buttonRef.current);

    gsap
      .timeline()
      .to(buttonRef.current, {
        y: -4,
        boxShadow: "0px 8px 20px rgba(0,0,0,0.4)",
        duration: 0.15,
        ease: "power2.out",
      })
      .to(buttonRef.current, {
        y: 0,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        duration: 0.2,
        ease: "power2.out",
      });
  };




  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-900 h-[100vh] w-[100vw] flex justify-center items-center text-white">
        <h1 ref={loadingRef} className="text-3xl flex font-bold">Loading.....</h1>
      </main>
    );
  }

  return (
    <>
      <div
        ref={rootRef}
        className="w-full text-black font-sans h-screen flex justify-center items-center"
      >
        <div
          ref={cardRef}
          className="w-full max-w-md p-4 bg-white rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                id="email"
                placeholder="Enter your email address"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              ref={buttonRef}
              onClick={onButtonClick}
              type="submit"
              className="w-full  hover:bg-slate-900 hover:text-white bg-blue-300 text-black font-bold font-mono p-2 rounded-xl"
            >
              Login
            </button>
          </form>

          <p className="text-center font-thin font-serif text-grey-600 mt-2">
            Dont have an account?{" "}
            <Link
              className="font-semibold underline font-serif hover:text-red-600"
              to={"/register"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
