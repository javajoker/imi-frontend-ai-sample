import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  DollarSign,
  TrendingUp,
  Star,
  FileText,
  ShoppingCart,
  Users,
  Bell,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery } from "react-query";
import { ipService } from "../../services/ipService";
import { productService } from "../../services/productService";
import {
  getTransactionsByUser,
  getLicenseApplicationsByApplicant,
  getLicenseApplicationsForCreator,
} from "../../data/mockData";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user-specific data based on user type
  const { data: userIPs, isLoading: ipsLoading } = useQuery(
    ["user-ips", user?.id],
    () =>
      user?.user_type === "creator"
        ? ipService.getUserIPAssets(user.id)
        : Promise.resolve([]),
    { enabled: user?.user_type === "creator" }
  );

  const { data: userProducts, isLoading: productsLoading } = useQuery(
    ["user-products", user?.id],
    () =>
      user?.user_type === "secondary_creator"
        ? productService.getUserProducts(user.id)
        : Promise.resolve([]),
    { enabled: user?.user_type === "secondary_creator" }
  );

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  const tabs = [
    { id: "overview", label: t("dashboard.overview") },
    { id: "activity", label: "Recent Activity" },
    { id: "notifications", label: t("dashboard.notifications"), show: true },
  ];

  // Get user statistics
  const getUserStats = () => {
    switch (user.user_type) {
      case "creator":
        return [
          {
            label: t("home.ipAssets"),
            value: user.profile_data.portfolio_count || 0,
            icon: Package,
            color: "blue",
            link: "/create",
          },
          {
            label: t("dashboard.totalRevenue"),
            value: `$${user.profile_data.total_revenue || 0}`,
            icon: DollarSign,
            color: "green",
            link: "/create?tab=analytics",
          },
          {
            label: t("dashboard.rating"),
            value: user.profile_data.rating || 0,
            icon: Star,
            color: "yellow",
          },
          {
            label: "Active Licenses",
            value: getLicenseApplicationsForCreator(user.id).filter(
              (l) => l.status === "approved"
            ).length,
            icon: FileText,
            color: "purple",
            link: "/create?tab=manage-licenses",
          },
        ];
      case "secondary_creator":
        return [
          {
            label: t("home.products"),
            value: user.profile_data.products_created || 0,
            icon: Package,
            color: "blue",
            link: "/create",
          },
          {
            label: t("dashboard.totalRevenue"),
            value: `$${user.profile_data.total_revenue || 0}`,
            icon: DollarSign,
            color: "green",
            link: "/create?tab=analytics",
          },
          {
            label: t("dashboard.licenses"),
            value: user.profile_data.licenses_held || 0,
            icon: FileText,
            color: "purple",
            link: "/create?tab=manage-licenses",
          },
          {
            label: t("dashboard.rating"),
            value: user.profile_data.rating || 0,
            icon: Star,
            color: "yellow",
          },
        ];
      case "buyer":
        return [
          {
            label: t("dashboard.orders"),
            value: user.profile_data.orders_count || 0,
            icon: ShoppingCart,
            color: "blue",
            link: "/profile?tab=orders",
          },
          {
            label: t("dashboard.totalSpent"),
            value: `$${user.profile_data.total_spent || 0}`,
            icon: DollarSign,
            color: "green",
          },
          {
            label: "Verified Products",
            value: user.profile_data.orders_count || 0,
            icon: CheckCircle,
            color: "success",
          },
          {
            label: t("dashboard.rating"),
            value: user.profile_data.rating || 0,
            icon: Star,
            color: "yellow",
          },
        ];
      default:
        return [];
    }
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-2 mb-2">{t("dashboard.title")}</h1>
              <p className="text-gray-600">
                {t("dashboard.welcome")}, {user.profile_data.display_name}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  3
                </span>
              </div>

              {/* Quick Action Button */}
              {user.user_type !== "buyer" && (
                <Link to="/create">
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    {user.user_type === "creator"
                      ? "Register IP"
                      : "Create Product"}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* User Type Badge */}
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.user_type === "creator"
                  ? "bg-purple-100 text-purple-800"
                  : user.user_type === "secondary_creator"
                  ? "bg-teal-100 text-teal-800"
                  : user.user_type === "buyer"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {t(`userTypes.${user.user_type}`)} •{" "}
              {t(`status.${user.verification_level}`)}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container-responsive py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const StatCard = (
                  <div className="bg-white rounded-lg p-6 shadow-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                      </div>
                      <div
                        className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-6 h-6 text-${stat.color}-600`}
                        />
                      </div>
                    </div>
                  </div>
                );

                return stat.link ? (
                  <Link key={index} to={stat.link} className="block hover-lift">
                    {StatCard}
                  </Link>
                ) : (
                  <div key={index}>{StatCard}</div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.user_type === "creator" && (
                  <>
                    <Link
                      to="/create"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Register New IP</span>
                    </Link>
                    <Link
                      to="/create?tab=manage-licenses"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Manage Licenses</span>
                    </Link>
                    <Link
                      to="/create?tab=analytics"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">View Analytics</span>
                    </Link>
                  </>
                )}

                {user.user_type === "secondary_creator" && (
                  <>
                    <Link
                      to="/browse-ip"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Browse IP</span>
                    </Link>
                    <Link
                      to="/create"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Create Product</span>
                    </Link>
                    <Link
                      to="/create?tab=analytics"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">View Analytics</span>
                    </Link>
                  </>
                )}

                {user.user_type === "buyer" && (
                  <>
                    <Link
                      to="/marketplace"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Shop Products</span>
                    </Link>
                    <Link
                      to="/verify"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Verify Products</span>
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Order History</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Content based on user type */}
            {user.user_type === "creator" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent IP Assets */}
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent IP Assets</h3>
                    <Link
                      to="/create"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  {ipsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="space-y-3">
                      {userIPs?.slice(0, 3).map((ip) => (
                        <Link
                          key={ip.id}
                          to={`/ip/${ip.id}`}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={ip.file_urls[0]}
                            alt=""
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {ip.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ip.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {ip.stats?.views || 0} views
                            </div>
                            <div className="text-xs text-gray-500">
                              {ip.stats?.license_applications || 0} applications
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* License Applications */}
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      License Applications
                    </h3>
                    <Link
                      to="/create?tab=manage-licenses"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {getLicenseApplicationsForCreator(user.id)
                      .slice(0, 3)
                      .map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              Application #{app.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(app.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === "approved"
                                ? "bg-success-100 text-success-800"
                                : app.status === "rejected"
                                ? "bg-error-100 text-error-800"
                                : "bg-warning-100 text-warning-800"
                            }`}
                          >
                            {t(`status.${app.status}`)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {user.user_type === "secondary_creator" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Products */}
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Products</h3>
                    <Link
                      to="/create"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  {productsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="space-y-3">
                      {userProducts?.slice(0, 3).map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${product.price}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {product.stats?.views || 0} views
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.stats?.purchases || 0} sales
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* My License Applications */}
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">My Applications</h3>
                    <Link
                      to="/create?tab=manage-licenses"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {getLicenseApplicationsByApplicant(user.id)
                      .slice(0, 3)
                      .map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              Application #{app.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(app.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === "approved"
                                ? "bg-success-100 text-success-800"
                                : app.status === "rejected"
                                ? "bg-error-100 text-error-800"
                                : "bg-warning-100 text-warning-800"
                            }`}
                          >
                            {t(`status.${app.status}`)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {user.user_type === "buyer" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                    <Link
                      to="/profile?tab=orders"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {getTransactionsByUser(user.id)
                      .slice(0, 3)
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">Order #{tx.id}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${tx.amount}</div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                tx.status === "completed"
                                  ? "bg-success-100 text-success-800"
                                  : tx.status === "pending"
                                  ? "bg-warning-100 text-warning-800"
                                  : "bg-error-100 text-error-800"
                              }`}
                            >
                              {t(`status.${tx.status}`)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="bg-white rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Recommended for You
                    </h3>
                    <Link
                      to="/marketplace"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Browse More
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Start shopping to get personalized recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-lg p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  action: "New license application approved",
                  time: "2 hours ago",
                  type: "success",
                },
                {
                  action: 'Product "Mountain T-Shirt" received new review',
                  time: "1 day ago",
                  type: "info",
                },
                {
                  action: "Revenue payment processed",
                  time: "3 days ago",
                  type: "success",
                },
                {
                  action: 'IP asset "Sunset Landscape" was verified',
                  time: "1 week ago",
                  type: "success",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-success-500"
                        : activity.type === "warning"
                        ? "bg-warning-500"
                        : "bg-primary-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Mark All as Read
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "License Application Approved",
                  message:
                    'Your license application for "Sunset Mountain Landscape" has been approved.',
                  time: "2 hours ago",
                  read: false,
                  type: "success",
                },
                {
                  title: "New Order Received",
                  message:
                    'Jane Smith purchased your "Mountain T-Shirt" for $29.99.',
                  time: "1 day ago",
                  read: false,
                  type: "info",
                },
                {
                  title: "Payout Processed",
                  message: "Your payout of $125.50 has been processed.",
                  time: "3 days ago",
                  read: true,
                  type: "success",
                },
              ].map((notification, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-colors ${
                    !notification.read
                      ? "border-primary-200 bg-primary-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "success"
                          ? "bg-success-500"
                          : notification.type === "warning"
                          ? "bg-warning-500"
                          : "bg-primary-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium ${
                          !notification.read
                            ? "text-primary-900"
                            : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          !notification.read
                            ? "text-primary-800"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
