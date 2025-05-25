import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "../atoms/Button";

interface Props {
  children: ReactNode | ReactNode[];
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page or return to the homepage.
            </p>

            {import.meta.env.VITE_ENVIRONMENT === "development" && this.state.error && (
              <details className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <summary className="text-sm font-medium text-red-800 cursor-pointer">
                  Error Details (Development Mode)
                </summary>
                <div className="mt-2 text-xs text-red-700">
                  <div className="font-medium">
                    Error: {this.state.error.name}
                  </div>
                  <div className="mt-1">{this.state.error.message}</div>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                fullWidth
              >
                Refresh Page
              </Button>
              <Button variant="secondary" onClick={this.handleGoHome} fullWidth>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
