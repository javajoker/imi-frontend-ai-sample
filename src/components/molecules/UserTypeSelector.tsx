import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { mockUsers } from "../../data/mockData";

const UserTypeSelector: React.FC = () => {
  const { user, switchUser } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="bg-warning-50 border-b border-warning-200 px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm text-warning-800 font-medium">
            🚧 Demo Mode - Switch User Type:
          </span>
          <div className="flex space-x-2">
            {mockUsers.map((demoUser) => (
              <button
                key={demoUser.id}
                onClick={() => switchUser(demoUser.id)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  user.id === demoUser.id
                    ? "bg-warning-600 text-white"
                    : "bg-white text-warning-800 hover:bg-warning-100 border border-warning-300"
                }`}
              >
                {t(`userTypes.${demoUser.user_type}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
