import React, { use } from "react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {

  //GSAP CODE
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const loadingRef = useRef(null);
  useGSAP(
    () => {
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
    { scope: rootRef },
  );
  useGSAP(
    ()=>{
      gsap.to(loadingRef.current,{
         opacity:0.3,
         duration : 1,
         delay:0.5,
         yoyo: true,
         repeat : -1
      })
    }
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


  const { handleRegister, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");


  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister({ username, email, password });
      alert("Registration successful!, Please log into your account"); // show success message
      navigate('/login');   // 🔥 only runs if success
    } catch (error) {
      alert(error.message); // show backend error
    }
  };

 if (loading) {
    return (
      <main className="bg-gray-800 h-[100vh] w-[100vw] flex justify-center items-center text-white">
        <h1 ref={loadingRef} className="text-3xl flex font-bold">Loading.....</h1>
      </main>
    );
  }



  return (
    <>
      <div
        ref={rootRef}
        className="w-full h-screen flex justify-center items-center"
      >
        <div
          ref={cardRef}
          className="w-full max-w-md p-4  bg-white rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                onChange={(e) => { setUsername(e.target.value) }}
                placeholder="Enter username"
                type="text"
                id="username"
                name="username"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                onChange={(e) => { setEmail(e.target.value) }}
                placeholder="Enter your email"
                type="email"
                id="email"
                name="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                onChange={(e) => { setPassword(e.target.value) }}
                placeholder="Enter your password"
                type="password"
                id="password"
                name="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              ref={buttonRef}
              onClick={onButtonClick}
              type="submit"
              className="w-full bg-blue-300 text-black font-mono font-bold p-2 rounded-xl"
            >
              Register
            </button>
          </form>

          <p className="text-center text-grey-600 mt-2">
            Already have an account?{" "}
            <Link className="font-bold underline" to={"/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
