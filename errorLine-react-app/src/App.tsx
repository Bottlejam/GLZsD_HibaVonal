import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoleBasedDashboard from "./pages/actions/RoleBasedDashBoard";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./pages/actions/AuthContext";

const AppRoutes: React.FC = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <RoleBasedDashboard /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={token ? <RoleBasedDashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
     
        <BrowserRouter>
         <AuthProvider>
          <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
     
    </>
  );
};

export default App;
