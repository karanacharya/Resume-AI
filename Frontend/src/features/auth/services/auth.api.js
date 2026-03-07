import axios from 'axios'

const api = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true
});


/**
 * function to register a User
 * @requires username,email,password
 */
export async function register({ username, email, password }) {
   try {
      const response = await api.post("/api/auth/register", {
         username, email, password
      });
      if (!response) {
         console.log("Registraion failed");
         return;
      }
      return response.data
   } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      throw new Error(message);
   }
}

/**
 * function to login a user
 * @requires email,password
 */
export async function login({ email, password }) {
   try {
      const response = await api.post("/api/auth/login", {
         email, password
      });
      if (!response) {
         console.log("Login failed");
         return;
      }
      return response.data
   } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      throw new Error(message);
   }
}


/**
 * function to logout a user
 * @returns a response saying user logged out
 */
export async function logout() {
   try {
      const response = await api.get("/api/auth/logout");
      return response.data

   } catch (error) {
      console.log(error)
   }
}


/**
 * function to get the profile of a user
 * @returns the profile of a user
 */
export async function getProfile() {
   try {
      const response = await api.get("/api/auth/profile");
      return response.data
   } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      throw new Error(message);
      
   }
}