import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientLogin from "./pages/PatientLogin";
import StaffLogin from "./pages/StaffLogin";
import PatientDashboard from "./pages/PatientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StaffPrepareClaim from "./pages/StaffPrepareClaim";
import StaffHome from "./pages/StaffHome";
import ViewClaims from "./pages/ViewClaims";
import UploadDocuments from "./pages/UploadDocuments";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/staff-prepare-claim" element={<StaffPrepareClaim />} />
          <Route path="/view-claims" element={<ViewClaims />} />
          <Route path="/upload-documents" element = {<UploadDocuments />} />
          <Route path="/staff-home" element={<StaffHome />} />
          

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
