import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  Save,
  AlertTriangle,
  Lock,
  Mail,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Card from "../../components/atoms/Card";
import Modal from "../../components/molecules/Modal";
import LanguageSwitcher from "../../components/molecules/LanguageSwitcher";
import toast from "react-hot-toast";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  email: {
    newOrders: boolean;
    licenseApplications: boolean;
    revenueUpdates: boolean;
    marketingEmails: boolean;
    systemUpdates: boolean;
  };
  push: {
    instantMessages: boolean;
    priceAlerts: boolean;
    systemUpdates: boolean;
  };
  sms: {
    securityAlerts: boolean;
    importantUpdates: boolean;
  };
}

interface PrivacySettings {
  profileVisibility: boolean;
  showPortfolioCount: boolean;
  showRevenueStats: boolean;
  allowContact: boolean;
  showOnlineStatus: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("account");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form for password change
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>();

  // Settings state
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      email: {
        newOrders: true,
        licenseApplications: true,
        revenueUpdates: true,
        marketingEmails: false,
        systemUpdates: true,
      },
      push: {
        instantMessages: true,
        priceAlerts: false,
        systemUpdates: true,
      },
      sms: {
        securityAlerts: true,
        importantUpdates: false,
      },
    });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: true,
    showPortfolioCount: true,
    showRevenueStats: false,
    allowContact: true,
    showOnlineStatus: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 60,
  });

  if (!user) return null;

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      // In a real app, this would call the API
      toast.success("Password updated successfully");
      setShowPasswordModal(false);
      resetPasswordForm();
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const handleNotificationChange = (
    category: keyof NotificationSettings,
    setting: string,
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
    toast.success("Notification settings updated");
  };

  const handlePrivacyChange = (
    setting: keyof PrivacySettings,
    value: boolean
  ) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    toast.success("Privacy settings updated");
  };

  const handleSecurityChange = (
    setting: keyof SecuritySettings,
    value: boolean | number
  ) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    toast.success("Security settings updated");
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would call the API to delete the account
      toast.success(
        "Account deletion initiated. You will receive a confirmation email."
      );
      setShowDeleteModal(false);
      logout();
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-heading-2 mb-2">{t("navigation.settings")}</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary-100 text-primary-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Email Address</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={user.email}
                            disabled
                            className="flex-1"
                          />
                          <Button variant="secondary" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Username</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={user.username}
                            disabled
                            className="flex-1"
                          />
                          <Button variant="secondary" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Language & Region
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">Language</label>
                        <LanguageSwitcher />
                        <p className="text-sm text-gray-500 mt-1">
                          Choose your preferred language for the interface
                        </p>
                      </div>
                      <div>
                        <label className="form-label">Timezone</label>
                        <select className="form-input">
                          <option>UTC-8 (Pacific Time)</option>
                          <option>UTC-5 (Eastern Time)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC+8 (Asia/Shanghai)</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Password</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Last changed: 3 months ago
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setShowPasswordModal(true)}
                        leftIcon={<Lock className="w-4 h-4" />}
                      >
                        Change Password
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 border-red-200 bg-red-50">
                    <h3 className="text-lg font-semibold mb-4 text-red-800">
                      Danger Zone
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-800">
                          Delete Account
                        </h4>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all associated
                          data
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notificationSettings.email).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <h4 className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {key === "newOrders" &&
                                  "Notifications about new orders and purchases"}
                                {key === "licenseApplications" &&
                                  "Updates on license applications and approvals"}
                                {key === "revenueUpdates" &&
                                  "Monthly revenue reports and payout notifications"}
                                {key === "marketingEmails" &&
                                  "Product updates and promotional emails"}
                                {key === "systemUpdates" &&
                                  "Important system updates and maintenance"}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  handleNotificationChange(
                                    "email",
                                    key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notificationSettings.push).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <h4 className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {key === "instantMessages" &&
                                  "Real-time messages and chat notifications"}
                                {key === "priceAlerts" &&
                                  "Notifications when prices change on watched items"}
                                {key === "systemUpdates" &&
                                  "Critical system updates and maintenance alerts"}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  handleNotificationChange(
                                    "push",
                                    key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Profile Privacy
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(privacySettings).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h4 className="font-medium">
                              {key === "profileVisibility" &&
                                "Profile Visibility"}
                              {key === "showPortfolioCount" &&
                                "Show Portfolio Count"}
                              {key === "showRevenueStats" &&
                                "Show Revenue Statistics"}
                              {key === "allowContact" && "Allow Contact"}
                              {key === "showOnlineStatus" &&
                                "Show Online Status"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {key === "profileVisibility" &&
                                "Make your profile visible to other users"}
                              {key === "showPortfolioCount" &&
                                "Display number of IP assets or products publicly"}
                              {key === "showRevenueStats" &&
                                "Show earnings information on your profile"}
                              {key === "allowContact" &&
                                "Let other users send you messages"}
                              {key === "showOnlineStatus" &&
                                "Show when you are online or offline"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                handlePrivacyChange(
                                  key as keyof PrivacySettings,
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Data & Analytics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Usage Analytics</h4>
                          <p className="text-sm text-gray-500">
                            Allow us to collect anonymous usage data to improve
                            the platform
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable 2FA</h4>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {securitySettings.twoFactorEnabled && (
                          <span className="text-sm text-success-600 font-medium">
                            Enabled
                          </span>
                        )}
                        <Button
                          variant={
                            securitySettings.twoFactorEnabled
                              ? "secondary"
                              : "primary"
                          }
                          onClick={() =>
                            handleSecurityChange(
                              "twoFactorEnabled",
                              !securitySettings.twoFactorEnabled
                            )
                          }
                        >
                          {securitySettings.twoFactorEnabled
                            ? "Disable"
                            : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Login Security
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Login Alerts</h4>
                          <p className="text-sm text-gray-500">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginAlerts}
                            onChange={(e) =>
                              handleSecurityChange(
                                "loginAlerts",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="form-label">
                          Session Timeout (minutes)
                        </label>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) =>
                            handleSecurityChange(
                              "sessionTimeout",
                              parseInt(e.target.value)
                            )
                          }
                          className="form-input w-48"
                        >
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={240}>4 hours</option>
                          <option value={480}>8 hours</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                          Automatically log out after this period of inactivity
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Active Sessions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                          <div>
                            <h4 className="font-medium">Current Session</h4>
                            <p className="text-sm text-gray-500">
                              Chrome on macOS • Last active: now
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-success-600">Active</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Methods
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-gray-400" />
                          <div>
                            <h4 className="font-medium">•••• •••• •••• 4242</h4>
                            <p className="text-sm text-gray-500">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                          <Button variant="danger" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                      <Button variant="secondary" fullWidth>
                        Add New Payment Method
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Invoice History
                    </h3>
                    <div className="space-y-4">
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No invoices found</p>
                        <p className="text-sm">
                          Your billing history will appear here
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form
          onSubmit={handlePasswordSubmit(handlePasswordChange)}
          className="space-y-4"
        >
          <Input
            label="Current Password"
            type="password"
            {...registerPassword("currentPassword", {
              required: "Current password is required",
            })}
            error={passwordErrors.currentPassword?.message}
          />

          <Input
            label="New Password"
            type="password"
            {...registerPassword("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={passwordErrors.newPassword?.message}
          />

          <Input
            label="Confirm New Password"
            type="password"
            {...registerPassword("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword("newPassword") ||
                "Passwords do not match",
            })}
            error={passwordErrors.confirmPassword?.message}
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-red-800">
                This action cannot be undone
              </h4>
            </div>
            <p className="text-sm text-red-700 mt-2">
              Deleting your account will permanently remove all your data,
              including:
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
              <li>Your profile and account information</li>
              <li>All your IP assets and products</li>
              <li>Order history and transactions</li>
              <li>Messages and notifications</li>
            </ul>
          </div>

          <div>
            <label className="form-label">
              Type "DELETE" to confirm account deletion
            </label>
            <Input placeholder="DELETE" />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
