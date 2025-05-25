import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import Button from "../components/atoms/Button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-16 h-16 text-primary-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Go Back
          </Button>

          <Link to="/">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Home className="w-5 h-5" />}
            >
              Go Home
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Looking for something specific?
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/browse-ip"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Browse IP Assets
            </Link>
            <Link
              to="/marketplace"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Shop Products
            </Link>
            <Link
              to="/verify"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Verify Products
            </Link>
            <Link
              to="/help"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Get Help
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Still can't find what you're looking for?{" "}
            <Link
              to="/contact"
              className="font-medium text-blue-800 hover:text-blue-900 hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
