import { useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Protected = ({ children}) =>{
   const { user, loading} = useAuth();
   const loadingRef = useRef(null);
   useGSAP(
    ()=>{
      gsap.to(loadingRef.current,{
        opacity : 0.3,
        repeat: -1,
        yoyo: true,
        delay:0.5,
        duration:1
      })
    }
  );
   

    if (loading) {
    return (
      <main className="bg-gray-800 h-[100vh] w-[100vw] flex justify-center items-center text-white">
        <h1 ref={loadingRef} className="text-3xl font-bold">Loading.....</h1>
      </main>
    );
  }

   if(!user){
    alert("No user found, please login to continue");
      return <Navigate to ={"/login"}/>
   }

   return children;
     
}

export default Protected;