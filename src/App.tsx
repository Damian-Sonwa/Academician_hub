import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import Progress from "./pages/Progress";
import PersonalInfo from "./pages/PersonalInfo";
import AIAssistant from "./pages/AIAssistant";
import Discussion from "./pages/Discussion";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import AdminCourses from "./pages/AdminCourses";
import Certification from "./pages/Certification";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Subscription from "./pages/Subscription";
import AdminPanel from "./pages/AdminPanel";
import AdminTopicView from "./pages/AdminTopicView";
import WeeklyCourseView from "./pages/WeeklyCourseView";
import Settings from "./pages/Settings";
import AlphabetLearning from "./pages/AlphabetLearning";
import Translator from "./pages/Translator";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/courses"
            element={
              <DashboardLayout>
                <Courses />
              </DashboardLayout>
            }
          />
          <Route
            path="/courses/:subject/:level"
            element={
              <DashboardLayout>
                <CoursePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/course/:id"
            element={
              <DashboardLayout>
                <CoursePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/progress"
            element={
              <DashboardLayout>
                <Progress />
              </DashboardLayout>
            }
          />
          <Route
            path="/personal-info"
            element={
              <DashboardLayout>
                <PersonalInfo />
              </DashboardLayout>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <DashboardLayout>
                <AIAssistant />
              </DashboardLayout>
            }
          />
          <Route
            path="/discussion"
            element={
              <DashboardLayout>
                <Discussion />
              </DashboardLayout>
            }
          />
          <Route
            path="/resources"
            element={
              <DashboardLayout>
                <Resources />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <DashboardLayout>
                <Admin />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <DashboardLayout>
                <AdminCourses />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/topic/:courseId/:topicIndex"
            element={
              <DashboardLayout>
                <AdminTopicView />
              </DashboardLayout>
            }
          />
          <Route
            path="/course/:courseId/weekly/:level"
            element={
              <DashboardLayout>
                <WeeklyCourseView />
              </DashboardLayout>
            }
          />
          <Route
            path="/certification"
            element={
              <DashboardLayout>
                <Certification />
              </DashboardLayout>
            }
          />
          <Route
            path="/subscription"
            element={
              <DashboardLayout>
                <Subscription />
              </DashboardLayout>
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin-panel" element={<DashboardLayout><AdminPanel /></DashboardLayout>} />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />
          <Route
            path="/alphabet-learning"
            element={
              <DashboardLayout>
                <AlphabetLearning />
              </DashboardLayout>
            }
          />
          <Route
            path="/translator"
            element={
              <DashboardLayout>
                <Translator />
              </DashboardLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
