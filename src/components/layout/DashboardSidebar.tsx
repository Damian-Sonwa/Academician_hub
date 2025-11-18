import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  User,
  Bot,
  MessageSquare,
  FolderOpen,
  Shield,
  Award,
  CreditCard,
  Languages,
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Languages, label: "Translator", path: "/translator" },
  { icon: User, label: "Personal Info", path: "/personal-info" },
  { icon: Bot, label: "AI Assistant", path: "/ai-assistant" },
  { icon: MessageSquare, label: "Discussion", path: "/discussion" },
  { icon: FolderOpen, label: "Resources", path: "/resources" },
  { icon: Shield, label: "Security", path: "/admin" },
  { icon: Award, label: "Certification", path: "/certification" },
  { icon: CreditCard, label: "Subscription", path: "/subscription" },
];

export default function DashboardSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin-panel"
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/courses"
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Admin Courses</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
