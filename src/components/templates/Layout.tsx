import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import UserTypeSelector from "../molecules/UserTypeSelector";
import { useAuth } from "../../contexts/AuthContext";

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Demo user selector - only show in development */}
      {import.meta.env.VITE_ENVIRONMENT === "development" && <UserTypeSelector />}

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
