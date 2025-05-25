import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import "./i18n";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import LoadingSpinner from "./components/atoms/LoadingSpinner";
import ErrorBoundary from "./components/organisms/ErrorBoundary";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
console.log(import.meta.env.VITE_ENVIRONMENT)
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <LanguageProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                <Suspense fallback={<LoadingSpinner />}>
                  <AppRoutes />
                </Suspense>

                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                    success: {
                      style: {
                        background: "#10b981",
                      },
                    },
                    error: {
                      style: {
                        background: "#ef4444",
                      },
                    },
                  }}
                />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </Router>

        {/* React Query Devtools */}
        {import.meta.env.VITE_ENVIRONMENT === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
