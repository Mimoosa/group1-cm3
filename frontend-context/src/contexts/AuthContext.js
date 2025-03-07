// src/contexts/AuthContext.js
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;