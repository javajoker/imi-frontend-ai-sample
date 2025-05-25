import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Shield,
  CreditCard,
  Settings,
  Bell,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  Search,
  Filter,
  Download,
  MoreVertical,
  Check,
  X,
  UserCheck,
  UserX,
  Flag,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery } from "react-query";
import {
  mockUsers,
  mockIPAssets,
  mockProducts,
  mockTransactions,
  mockPlatformAnalytics,
  mockAdminNotifications,
} from "../../data/mockData";
import Button from "../../components/atoms/Button";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: t("admin.overview"), icon: BarChart3 },
    { id: "users", label: t("admin.userManagement"), icon: Users },
    { id: "content", label: t("admin.contentModeration"), icon: Shield },
    { id: "transactions", label: t("admin.transactions"), icon: CreditCard },
    { id: "analytics", label: t("admin.analytics"), icon: TrendingUp },
    { id: "settings", label: t("admin.settings"), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-red-600 text-white">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
              <p className="text-red-100">{t("admin.subtitle")}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-white text-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                  {
                    mockAdminNotifications.filter((n) => n.status === "unread")
                      .length
                  }
                </span>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium">Admin Panel</div>
                <div className="text-xs text-red-200">v1.0.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container-responsive py-8">
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "content" && <ContentModeration />}
        {activeTab === "transactions" && <TransactionManagement />}
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      label: t("admin.totalUsers"),
      value: mockPlatformAnalytics.overview.total_users.toLocaleString(),
      change: `+${mockPlatformAnalytics.growth.user_growth}%`,
      icon: Users,
      color: "blue",
    },
    {
      label: t("admin.totalRevenue"),
      value: `$${mockPlatformAnalytics.overview.total_revenue.toLocaleString()}`,
      change: `+${mockPlatformAnalytics.growth.revenue_growth}%`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: t("admin.ipAssets"),
      value: mockPlatformAnalytics.overview.total_ip_assets.toLocaleString(),
      change: "+156 this week",
      icon: Package,
      color: "purple",
    },
    {
      label: t("admin.products"),
      value: mockPlatformAnalytics.overview.total_products.toLocaleString(),
      change: `+${mockPlatformAnalytics.growth.transaction_growth}%`,
      icon: Package,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                  <div
                    className={`text-xs font-medium ${
                      stat.change.startsWith("+")
                        ? "text-success-600"
                        : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium">{t("admin.recentActivity")}</h3>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {[
              {
                action: t("admin.newUserRegistration"),
                user: "designer_pro",
                time: "5 min ago",
                type: "info",
              },
              {
                action: t("admin.ipAssetUploaded"),
                user: "artisan_creator",
                time: "15 min ago",
                type: "success",
              },
              {
                action: t("admin.copyrightReportFiled"),
                user: "reporter_user",
                time: "1 hour ago",
                type: "warning",
              },
              {
                action: t("admin.largeTransactionProcessed"),
                user: "buyer_premium",
                time: "2 hours ago",
                type: "info",
              },
              {
                action: t("admin.licenseApplicationApproved"),
                user: "product_maker",
                time: "3 hours ago",
                type: "success",
              },
            ].map((activity, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center space-x-3">
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
                    <div className="text-xs text-gray-500">
                      by {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium">{t("admin.priorityAlerts")}</h3>
          </div>
          <div className="divide-y">
            {mockAdminNotifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 ${
                      notification.priority === "critical"
                        ? "text-red-500"
                        : notification.priority === "high"
                        ? "text-orange-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      notification.priority === "critical"
                        ? "bg-red-100 text-red-800"
                        : notification.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {notification.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.profile_data.display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesType = !userTypeFilter || user.user_type === userTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("admin.userManagement")}</h2>
        <div className="flex space-x-2">
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">{t("admin.allUsers")}</option>
            <option value="creator">Creators</option>
            <option value="secondary_creator">Secondary Creators</option>
            <option value="buyer">Buyers</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("admin.user")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("admin.joined")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.profile_data.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.profile_data.display_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                      {user.user_type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "active"
                          ? "bg-success-100 text-success-800"
                          : user.status === "suspended"
                          ? "bg-warning-100 text-warning-800"
                          : "bg-error-100 text-error-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        {t("admin.view")}
                      </button>
                      <button className="text-warning-600 hover:text-warning-900">
                        {t("admin.edit")}
                      </button>
                      {user.status === "active" ? (
                        <button className="text-error-600 hover:text-error-900">
                          {t("admin.suspend")}
                        </button>
                      ) : (
                        <button className="text-success-600 hover:text-success-900">
                          {t("admin.activate")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Content Moderation Component
const ContentModeration: React.FC = () => {
  const { t } = useLanguage();
  const [contentFilter, setContentFilter] = useState("pending");

  const filteredContent = mockIPAssets.filter((ip) => {
    if (contentFilter === "pending")
      return ip.verification_status === "pending";
    if (contentFilter === "approved")
      return ip.verification_status === "approved";
    if (contentFilter === "rejected")
      return ip.verification_status === "rejected";
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("admin.contentModeration")}</h2>
        <div className="flex space-x-2">
          <select
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="pending">{t("admin.pendingReview")}</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">{t("admin.allContent")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((ip) => {
          const creator = mockUsers.find((u) => u.id === ip.creator_id);
          return (
            <div
              key={ip.id}
              className="bg-white rounded-lg shadow-card overflow-hidden"
            >
              <img
                src={ip.file_urls[0]}
                alt=""
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium truncate">{ip.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      ip.verification_status === "approved"
                        ? "bg-success-100 text-success-800"
                        : ip.verification_status === "rejected"
                        ? "bg-error-100 text-error-800"
                        : "bg-warning-100 text-warning-800"
                    }`}
                  >
                    {ip.verification_status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 truncate-2">
                  {ip.description}
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <img
                    src={creator?.profile_data.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    {creator?.profile_data.display_name}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  {t("admin.category")}: {ip.category} • {t("admin.uploaded")}:{" "}
                  {new Date(ip.created_at).toLocaleDateString()}
                </div>

                {ip.verification_status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      variant="success"
                      size="sm"
                      fullWidth
                      onClick={() => alert("IP approved!")}
                    >
                      {t("admin.approve")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={() => alert("IP rejected!")}
                    >
                      {t("admin.reject")}
                    </Button>
                  </div>
                )}

                {ip.verification_status !== "pending" && (
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" fullWidth>
                      {t("admin.view")} Details
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Transaction Management Component
const TransactionManagement: React.FC = () => {
  const { t } = useLanguage();
  const [transactionFilter, setTransactionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("last30Days");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {t("admin.transactionMonitoring")}
        </h2>
        <div className="flex space-x-2">
          <select
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">{t("admin.allTransactions")}</option>
            <option value="product_sale">{t("admin.productSales")}</option>
            <option value="license_fee">{t("admin.licenseFees")}</option>
            <option value="revenue_share">{t("admin.revenueShares")}</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="last7Days">{t("admin.last7Days")}</option>
            <option value="last30Days">{t("admin.last30Days")}</option>
            <option value="last3Months">{t("admin.last3Months")}</option>
            <option value="allTime">{t("admin.allTime")}</option>
          </select>

          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t("admin.exportReport")}
          </Button>
        </div>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="text-2xl font-bold text-success-600 mb-1">
            $125,430
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {t("admin.totalVolume")}
          </div>
          <div className="text-xs text-success-600">+12.5% vs last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            $12,543
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {t("admin.platformFees")}
          </div>
          <div className="text-xs text-primary-600">+8.2% vs last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="text-2xl font-bold text-purple-600 mb-1">1,234</div>
          <div className="text-sm text-gray-500 mb-2">Transactions</div>
          <div className="text-xs text-purple-600">+15.3% vs last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="text-2xl font-bold text-orange-600 mb-1">$101.50</div>
          <div className="text-sm text-gray-500 mb-2">
            {t("admin.avgTransaction")}
          </div>
          <div className="text-xs text-orange-600">-2.1% vs last month</div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t("admin.amount")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t("admin.buyer")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t("admin.seller")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTransactions
              .concat([
                {
                  id: "2",
                  transaction_type: "license_fee",
                  buyer_id: "2",
                  seller_id: "1",
                  amount: 50.0,
                  platform_fee: 5.0,
                  revenue_shares: { seller: 45.0, platform: 5.0 },
                  payment_method: "credit_card",
                  status: "completed",
                  processed_at: "2024-03-14T09:30:00Z",
                  created_at: "2024-03-14T09:30:00Z",
                },
                {
                  id: "3",
                  transaction_type: "product_sale",
                  buyer_id: "3",
                  seller_id: "2",
                  amount: 89.99,
                  platform_fee: 8.99,
                  revenue_shares: {
                    seller: 67.5,
                    ip_creator: 13.5,
                    platform: 8.99,
                  },
                  payment_method: "paypal",
                  status: "completed",
                  processed_at: "2024-03-13T14:15:00Z",
                  created_at: "2024-03-13T14:15:00Z",
                },
              ])
              .map((tx) => {
                const buyer = mockUsers.find((u) => u.id === tx.buyer_id);
                const seller = mockUsers.find((u) => u.id === tx.seller_id);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      #{tx.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                        {tx.transaction_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {buyer?.profile_data.display_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {seller?.profile_data.display_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          tx.status === "completed"
                            ? "bg-success-100 text-success-800"
                            : tx.status === "pending"
                            ? "bg-warning-100 text-warning-800"
                            : "bg-error-100 text-error-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Admin Analytics Component
const AdminAnalytics: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("admin.platformAnalytics")}</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option>{t("admin.last30Days")}</option>
            <option>{t("admin.last7Days")}</option>
            <option>{t("admin.last3Months")}</option>
            <option>Last Year</option>
          </select>
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t("admin.exportReport")}
          </Button>
        </div>
      </div>

      {/* Analytics Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-medium mb-4">
            {t("admin.revenueTrends")}
          </h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Revenue trend chart</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-medium mb-4">{t("admin.userGrowth")}</h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>User growth chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h4 className="font-medium mb-4">{t("admin.topCategories")}</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Digital Art</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pattern Design</span>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Photography</span>
              <span className="text-sm font-medium">18%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Illustration</span>
              <span className="text-sm font-medium">12%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card">
          <h4 className="font-medium mb-4">
            {t("admin.geographicDistribution")}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.unitedStates")}</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.europe")}</span>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.asia")}</span>
              <span className="text-sm font-medium">22%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.other")}</span>
              <span className="text-sm font-medium">15%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card">
          <h4 className="font-medium mb-4">{t("admin.platformHealth")}</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.activeUsers")}</span>
              <span className="text-sm font-medium text-success-600">89%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.licenseApprovalRate")}</span>
              <span className="text-sm font-medium text-success-600">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.customerSatisfaction")}</span>
              <span className="text-sm font-medium text-success-600">
                4.8/5
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("admin.disputeRate")}</span>
              <span className="text-sm font-medium text-success-600">0.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Settings Component
const AdminSettings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{t("admin.platformSettings")}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-medium mb-4">
            {t("admin.generalSettings")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">{t("admin.platformName")}</label>
              <input
                type="text"
                defaultValue="IPMarket"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">
                {t("admin.defaultPlatformFee")}
              </label>
              <input type="number" defaultValue="10" className="form-input" />
            </div>
            <div>
              <label className="form-label">{t("admin.maxRevenueShare")}</label>
              <input type="number" defaultValue="50" className="form-input" />
            </div>
            <div>
              <label className="form-label">
                {t("admin.autoApprovalThreshold")}
              </label>
              <input type="number" defaultValue="100" className="form-input" />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-medium mb-4">
            {t("admin.paymentSettings")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {t("admin.stripeIntegration")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("admin.stripeDesc")}
                </div>
              </div>
              <button className="bg-success-100 text-success-800 px-3 py-1 rounded text-sm">
                {t("admin.connected")}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {t("admin.paypalIntegration")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("admin.paypalDesc")}
                </div>
              </div>
              <button className="bg-success-100 text-success-800 px-3 py-1 rounded text-sm">
                {t("admin.connected")}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t("admin.cryptocurrency")}</div>
                <div className="text-sm text-gray-500">
                  {t("admin.cryptoDesc")}
                </div>
              </div>
              <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                {t("admin.disabled")}
              </button>
            </div>
            <div>
              <label className="form-label">{t("admin.minimumPayout")}</label>
              <input type="number" defaultValue="25" className="form-input" />
            </div>
          </div>
        </div>

        {/* Content Moderation */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-medium mb-4">
            {t("admin.contentModeration")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.autoApproveVerified")}</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.aiContentScreening")}</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.manualReviewRequired")}</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div>
              <label className="form-label">{t("admin.maxFileSize")}</label>
              <input type="number" defaultValue="10" className="form-input" />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-medium mb-4">
            {t("admin.emailSettings")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">{t("admin.smtpServer")}</label>
              <input
                type="text"
                defaultValue="smtp.mailgun.org"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">{t("admin.fromEmail")}</label>
              <input
                type="email"
                defaultValue="noreply@ipmarket.com"
                className="form-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("admin.sendWelcomeEmails")}</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {t("admin.transactionNotifications")}
              </span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={() => alert("Settings saved successfully!")}
        >
          {t("admin.saveAllSettings")}
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
