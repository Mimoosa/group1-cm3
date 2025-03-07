import { useState } from "react";
import { api } from "../services/api";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const login = async ({ username, password }) => {
        setIsLoading(true);
        setError(null);

        try {
            const json = await api.post('/users/login', { username, password });
            localStorage.setItem('user', JSON.stringify(json));
            setIsLoading(false);
            return json;
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
            return null;
        }
    };

    return { login, isLoading, error };
};