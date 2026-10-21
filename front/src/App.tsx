import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/app/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />

        {/* Страницы авторизации */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Сохраняем старые ссылки на дашборд */}
        <Route path="/app" element={<Navigate to="/" replace />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <AuthLayout>
              <NotFoundPage />
            </AuthLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
