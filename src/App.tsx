import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { Faculty } from "./pages/Faculty";
import { FacultHome } from "./pages/FacultHome";
import StdLogin from "./pages/StdLogin";
import StdSignup from "./pages/StdSignup";
import LiveRoom from "./pages/LivRoom";
import ResumeUpload from "./pages/ResumeUpload";
import { StudentHome } from "./pages/StudentHome";
import ProtectedRoute from "./pages/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userlogin" element={<StdLogin />} />
          <Route path="/usersignup" element={<StdSignup />} />
          <Route path="/group-discussion" element={<NotFound />} />
          <Route path="/personal-interview" element={<NotFound />} />
          <Route path="/features" element={<NotFound />} />
          <Route path="/resources" element={<NotFound />} />
          <Route path="/FacultyHome" element={<FacultHome />} />
          <Route path="/StdHome" element={<StudentHome />} />
          <Route
            path="/room"
            element={
              <ProtectedRoute>
                <LiveRoom />
              </ProtectedRoute>
            }
          />
          <Route path="/ResumeUpload" element={<ResumeUpload />} />
          {/* <Route path="*" element={<Navigate to="/login" replace/>} /> */}
          <Route path="*" element={<Navigate to="/userlogin" replace/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
