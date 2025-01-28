import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Oversikt from "./pages/Oversikt";
import TaskManagement from "./pages/TaskManagement";
import DocumentManagement from "./pages/DocumentManagement";
import AssetsLiabilities from "./pages/AssetsLiabilities";
import CollaborationTools from "./pages/CollaborationTools";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Boregnskap from "./pages/Boregnskap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oversikt" element={<Oversikt />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/finance" element={<AssetsLiabilities />} />
            <Route path="/boregnskap" element={<Boregnskap />} />
            <Route path="/collaboration" element={<CollaborationTools />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;