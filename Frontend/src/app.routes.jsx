import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"



export const router = createBrowserRouter([
    {
        path : "/login",    
        element: <Login/>
    },
    {
        path :'/register',
        element :<Register/>
    },
    {
        path :"/",
        element: <Protected>
            <h1 className="bg-gray-800 h-[100vh] w-[100vw] font-bold text-2xl text-white">Home Page...</h1>
        </Protected>
    }
])