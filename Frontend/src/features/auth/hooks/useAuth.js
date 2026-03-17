import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    /**
     * Function to Login a user
     * @param {email, password} param 
     */
    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return data //pass the error upwards
        } catch (error) {
           throw error
        } finally {
            setLoading(false);
        }

    }

    /**
    * Function to Register a user
    * @param {username, email, password} param 
    */
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password })
            setUser(data.user);
            return data; 
        } catch (error) {
            throw error; //pass error upward
        } finally {
            setLoading(false);
        }
    }

    /**
     * Function to Logout a user
     */
    const handleLogout = async () => {
        setLoading(true);
        const data = await logout()
        setUser(null);
        setLoading(false);
    }


  

    return { user, loading, handleLogin, handleRegister, handleLogout }
}