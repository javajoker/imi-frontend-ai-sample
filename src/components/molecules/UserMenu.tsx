import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  ChevronDown,
  BarChart3,
  Package,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  if (!user) return null;

  // Define menu items based on user type
  const getMenuItems = () => {
    const commonItems = [
      { path: "/dashboard", label: t("navigation.dashboard"), icon: BarChart3 },
      { path: "/profile", label: t("navigation.profile"), icon: User },
      { path: "/settings", label: t("navigation.settings"), icon: Settings },
    ];

    const userTypeItems = {
      creator: [
        { path: "/create", label: t("navigation.create"), icon: Package },
      ],
      secondary_creator: [
        { path: "/create", label: t("navigation.create"), icon: Package },
      ],
      buyer: [],
      admin: [{ path: "/admin", label: t("navigation.admin"), icon: Shield }],
    };

    return [...commonItems, ...userTypeItems[user.user_type]];
  };

  const menuItems = getMenuItems();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img
          src={user.profile_data.avatar}
          alt={user.profile_data.display_name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.profile_data.display_name}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {t(`userTypes.${user.user_type}`)}
          </div>
        </div>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={user.profile_data.avatar}
                alt={user.profile_data.display_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user.profile_data.display_name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.email}
                </div>
                <div className="text-xs text-primary-600 capitalize">
                  {t(`userTypes.${user.user_type}`)} •{" "}
                  {t(`status.${user.verification_level}`)}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("navigation.logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
