import { useState } from "react";
import { api } from "../services/api";

const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const signup = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            const json = await api.post('/users/signup', userData);
            localStorage.setItem('user', JSON.stringify(json));
            setIsLoading(false);
            return json;
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
            return null;
        }
    };

    return { signup, isLoading, error };
};

export default useSignup;
