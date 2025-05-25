import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Camera,
  Save,
  Star,
  Package,
  DollarSign,
  Users,
  Edit3,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { User } from "../../types/auth";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import Card from "../../components/atoms/Card";
import Modal from "../../components/molecules/Modal";
import toast from "react-hot-toast";

interface ProfileFormData {
  display_name: string;
  bio: string;
  website?: string;
  location?: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    behance?: string;
  };
}

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      display_name: user?.profile_data.display_name || "",
      bio: user?.profile_data.bio || "",
      website: user?.profile_data.website || "",
      location: user?.profile_data.location || "",
      social_links: {
        twitter: user?.profile_data.social_links?.twitter || "",
        instagram: user?.profile_data.social_links?.instagram || "",
        behance: user?.profile_data.social_links?.behance || "",
      },
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updatedProfileData = {
        ...user.profile_data,
        ...data,
        social_links: {
          ...user.profile_data.social_links,
          ...data.social_links,
        },
      };

      updateUser({
        profile_data: updatedProfileData,
        updated_at: new Date().toISOString(),
      });

      setIsEditing(false);
      toast.success(t("messages.success.profileUpdated"));
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // In a real app, this would upload to a file storage service
      // For demo, we'll just use a placeholder URL
      const avatarUrl = `/api/placeholder/150/150?t=${Date.now()}`;

      updateUser({
        profile_data: {
          ...user.profile_data,
          avatar: avatarUrl,
        },
      });

      setShowAvatarModal(false);
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Get user statistics
  const getUserStats = () => {
    switch (user.user_type) {
      case "creator":
        return [
          {
            label: "IP Assets",
            value: user.profile_data.portfolio_count || 0,
            icon: Package,
            color: "blue",
          },
          {
            label: "Total Revenue",
            value: `$${user.profile_data.total_revenue || 0}`,
            icon: DollarSign,
            color: "green",
          },
          {
            label: "Active Licenses",
            value: user.profile_data.licenses_held || 0,
            icon: Users,
            color: "purple",
          },
          {
            label: "Rating",
            value: user.profile_data.rating || 0,
            icon: Star,
            color: "yellow",
          },
        ];
      case "secondary_creator":
        return [
          {
            label: "Products",
            value: user.profile_data.products_created || 0,
            icon: Package,
            color: "blue",
          },
          {
            label: "Total Revenue",
            value: `$${user.profile_data.total_revenue || 0}`,
            icon: DollarSign,
            color: "green",
          },
          {
            label: "Licenses Held",
            value: user.profile_data.licenses_held || 0,
            icon: Users,
            color: "purple",
          },
          {
            label: "Rating",
            value: user.profile_data.rating || 0,
            icon: Star,
            color: "yellow",
          },
        ];
      case "buyer":
        return [
          {
            label: "Orders",
            value: user.profile_data.orders_count || 0,
            icon: Package,
            color: "blue",
          },
          {
            label: "Total Spent",
            value: `$${user.profile_data.total_spent || 0}`,
            icon: DollarSign,
            color: "green",
          },
          {
            label: "Reviews",
            value: user.profile_data.reviews_count || 0,
            icon: Star,
            color: "yellow",
          },
          {
            label: "Rating",
            value: user.profile_data.rating || 0,
            icon: Star,
            color: "purple",
          },
        ];
      default:
        return [];
    }
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={user.profile_data.avatar}
                  alt={user.profile_data.display_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.profile_data.display_name}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-600">
                      <span className="capitalize">
                        {t(`userTypes.${user.user_type}`)}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        {t(`status.${user.verification_level}`)}
                      </span>
                      <span>•</span>
                      <span>
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "secondary" : "primary"}
                    onClick={() => setIsEditing(!isEditing)}
                    leftIcon={
                      isEditing ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Edit3 className="w-4 h-4" />
                      )
                    }
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                {!isEditing ? (
                  <div>
                    <p className="text-gray-700 mb-4">
                      {user.profile_data.bio || "No bio provided yet."}
                    </p>
                    {user.profile_data.location && (
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {user.profile_data.location}
                      </p>
                    )}
                    {user.profile_data.website && (
                      <p className="text-gray-600 text-sm mb-2">
                        🌐{" "}
                        <a
                          href={user.profile_data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {user.profile_data.website}
                        </a>
                      </p>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 max-w-2xl"
                  >
                    <Input
                      label="Display Name"
                      {...register("display_name", {
                        required: "Display name is required",
                      })}
                      error={errors.display_name?.message}
                    />

                    <TextArea
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      {...register("bio")}
                      error={errors.bio?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Website"
                        placeholder="https://your-website.com"
                        {...register("website")}
                        error={errors.website?.message}
                      />
                      <Input
                        label="Location"
                        placeholder="City, Country"
                        {...register("location")}
                        error={errors.location?.message}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Social Links
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Twitter"
                          placeholder="@username"
                          {...register("social_links.twitter")}
                        />
                        <Input
                          label="Instagram"
                          placeholder="@username"
                          {...register("social_links.instagram")}
                        />
                        <Input
                          label="Behance"
                          placeholder="username"
                          {...register("social_links.behance")}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!isDirty}
                        leftIcon={<Save className="w-4 h-4" />}
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}
                  >
                    <IconComponent
                      className={`w-6 h-6 text-${stat.color}-600`}
                    />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>

          {/* Activity & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    action: "Updated profile information",
                    time: "2 hours ago",
                    type: "info",
                  },
                  {
                    action: "Received 5-star review",
                    time: "1 day ago",
                    type: "success",
                  },
                  {
                    action: "License application approved",
                    time: "3 days ago",
                    type: "success",
                  },
                  {
                    action: "New product listed",
                    time: "1 week ago",
                    type: "info",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
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
                      <div className="text-sm text-gray-900">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Verified Creator",
                    description: "Complete profile verification",
                    earned: true,
                  },
                  {
                    name: "First Sale",
                    description: "Make your first sale",
                    earned: user.user_type !== "buyer",
                  },
                  {
                    name: "Top Rated",
                    description: "Maintain 4.5+ star rating",
                    earned: (user.profile_data.rating || 0) >= 4.5,
                  },
                  {
                    name: "Power Seller",
                    description: "Reach $1000 in sales",
                    earned: (user.profile_data.total_revenue || 0) >= 1000,
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned
                        ? "bg-success-50 border border-success-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-success-500" : "bg-gray-300"
                      }`}
                    >
                      {achievement.earned ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          achievement.earned
                            ? "text-success-800"
                            : "text-gray-600"
                        }`}
                      >
                        {achievement.name}
                      </div>
                      <div
                        className={`text-xs ${
                          achievement.earned
                            ? "text-success-600"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Update Profile Picture"
      >
        <div className="space-y-4">
          <div className="text-center">
            <img
              src={user.profile_data.avatar}
              alt="Current avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-sm text-gray-600">
              Choose a new profile picture. For best results, use a square image
              at least 200x200 pixels.
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAvatarUpload(file);
                }
              }}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Camera className="w-12 h-12 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Click to upload image
              </span>
              <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowAvatarModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
