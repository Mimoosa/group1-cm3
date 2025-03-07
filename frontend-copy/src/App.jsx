import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import AuthContext from './contexts/AuthContext' 
import { useAuthContext } from './contexts/AuthContext'; 

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage />} />
            <Route
              path="/jobs/add-job"
              element={isAuthenticated ? <AddJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-job/:id"
              element={isAuthenticated ? <EditJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });
  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <AppContent />
    </AuthContext.Provider>
  );
};

export default App;

