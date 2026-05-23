import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { getStoredToken } from "./utils/authStorage.js";

const ProtectedRoute = () =>
  getStoredToken() ? <DashboardPage /> : <Navigate to="/login" replace />;

const PublicRoute = () =>
  getStoredToken() ? <Navigate to="/dashboard" replace /> : <LoginPage />;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<PublicRoute />} />
      <Route path="/dashboard" element={<ProtectedRoute />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
