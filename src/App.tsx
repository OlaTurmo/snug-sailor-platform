
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Finance from "@/pages/Finance";
import Boregnskap from "@/pages/Boregnskap";
import NotFound from "@/pages/NotFound";
import Contact from "@/pages/Contact";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import AboutUs from "@/pages/AboutUs";
import Blog from "@/pages/Blog";
import TaskManagement from "@/pages/TaskManagement";
import DocumentManagement from "@/pages/DocumentManagement";
import CollaborationTools from "@/pages/CollaborationTools";
import AssetsLiabilities from "@/pages/AssetsLiabilities";
import Oversikt from "@/pages/Oversikt";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAllowed = useProtectedRoute();
  return isAllowed ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />

          {/* Protected routes */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boregnskap"
            element={
              <ProtectedRoute>
                <Boregnskap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-management"
            element={
              <ProtectedRoute>
                <TaskManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-management"
            element={
              <ProtectedRoute>
                <DocumentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collaboration-tools"
            element={
              <ProtectedRoute>
                <CollaborationTools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets-liabilities"
            element={
              <ProtectedRoute>
                <AssetsLiabilities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/oversikt"
            element={
              <ProtectedRoute>
                <Oversikt />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
