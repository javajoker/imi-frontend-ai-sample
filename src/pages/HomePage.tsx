import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Star,
  Verified,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "react-query";
import { ipService } from "../services/ipService";
import { productService } from "../services/productService";
import { mockPlatformAnalytics } from "../data/mockData";
import Button from "../components/atoms/Button";
import LoadingSpinner from "../components/atoms/LoadingSpinner";

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch featured data
  const { data: featuredIP, isLoading: ipLoading } = useQuery(
    "featured-ip",
    () => ipService.getIPAssets({ limit: 3 }),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: featuredProducts, isLoading: productsLoading } = useQuery(
    "featured-products",
    () => productService.getFeaturedProducts(3),
    { staleTime: 5 * 60 * 1000 }
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 section-padding">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-heading-1 mb-6 animate-fade-in">
              {t("home.heroTitle")}
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in">
              {t("home.heroSubtitle")}
            </p>

            {/* User Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="card card-hover p-6 text-center animate-slide-in">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("home.ipCreators")}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {t("home.ipCreatorsDesc")}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/create")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t("home.startCreating")}
                </Button>
              </div>

              <div className="card card-hover p-6 text-center animate-slide-in">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("home.productMakers")}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {t("home.productMakersDesc")}
                </p>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => navigate("/browse-ip")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t("home.browseIP")}
                </Button>
              </div>

              <div className="card card-hover p-6 text-center animate-slide-in">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("home.buyers")}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {t("home.buyersDesc")}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/marketplace")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t("home.shopNow")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 section-padding">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-card">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {mockPlatformAnalytics.overview.total_users.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">
                {t("home.totalUsers")}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-card">
              <div className="text-3xl font-bold text-success-600 mb-2">
                ${mockPlatformAnalytics.overview.total_revenue.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">
                {t("home.totalRevenue")}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-card">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {mockPlatformAnalytics.overview.total_ip_assets.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">{t("home.ipAssets")}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-card">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {mockPlatformAnalytics.overview.total_products.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">{t("home.products")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured IP Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-heading-2">{t("home.featuredIP")}</h2>
            <Link
              to="/browse-ip"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {ipLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="skeleton h-48 mb-4"></div>
                  <div className="skeleton h-4 mb-2"></div>
                  <div className="skeleton h-3 mb-3"></div>
                  <div className="skeleton h-6 w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredIP?.data?.slice(0, 3).map((ip) => (
                <Link
                  key={ip.id}
                  to={`/ip/${ip.id}`}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="aspect-video">
                    <img
                      src={ip.file_urls[0]}
                      alt={ip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 truncate">{ip.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 truncate-2">
                      {ip.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="badge badge-primary">{ip.category}</span>
                      {ip.verification_status === "approved" && (
                        <div className="flex items-center space-x-1 text-success-600">
                          <Verified className="w-4 h-4" />
                          <span className="text-xs">{t("home.verified")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="bg-gray-50 section-padding">
        <div className="container-responsive">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-heading-2">{t("home.popularProducts")}</h2>
            <Link
              to="/marketplace"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="skeleton h-48 mb-4"></div>
                  <div className="skeleton h-4 mb-2"></div>
                  <div className="skeleton h-3 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="skeleton h-6 w-16"></div>
                    <div className="skeleton h-6 w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts?.slice(0, 3).map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="aspect-video">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 truncate">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 truncate-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-success-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Verified className="w-4 h-4 text-primary-500" />
                        <span className="text-sm text-gray-500">
                          {t("home.verified")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your IP journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and makers who are already building the
            future of authentic products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/register")}
                >
                  Get Started Today
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate("/browse-ip")}
                  className="text-white border-white hover:bg-white hover:text-primary-600"
                >
                  Explore Platform
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
