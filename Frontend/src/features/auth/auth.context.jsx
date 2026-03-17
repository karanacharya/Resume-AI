import { createContext, useState, useEffect } from "react";
import { getProfile } from "./services/auth.api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getProfile();
                setUser(data.user);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

        getAndSetUser();
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )



}