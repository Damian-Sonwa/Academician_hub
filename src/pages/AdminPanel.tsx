import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, BookOpen, TrendingUp, Award, BarChart3, Loader2, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/integrations/api/client";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeUsers: number;
  completionRate: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    activeUsers: 0,
    completionRate: 0,
  });

  useEffect(() => {
    checkAccess();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated]);

  const checkAccess = () => {
    if (!isAuthenticated || user?.role !== 'admin') {
        toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch courses
      const coursesResponse = await apiClient.getCourses();
      const courses = coursesResponse.data || [];

      // Fetch users (placeholder - would need backend endpoint)
      const totalUsers = 150; // Mock data
      const activeUsers = 89;

      // Calculate stats
      setStats({
        totalUsers,
        totalCourses: courses.length,
        totalEnrollments: courses.reduce((sum: number, c: any) => sum + (c.enrolled || 0), 0),
        totalRevenue: 1250000, // Mock revenue
        activeUsers,
        completionRate: 68, // Mock completion rate
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load analytics");
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Platform analytics and management
          </p>
        </div>
        <Badge className="text-lg px-4 py-2" variant="default">
          Admin Access
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+18%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Activity className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+25%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average course completion
            </p>
          </CardContent>
        </Card>
            </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24" onClick={() => toast.info("Feature coming soon!")}>
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div>Manage Users</div>
              </div>
            </Button>
            <Button variant="outline" className="h-24" onClick={() => toast.info("Feature coming soon!")}>
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div>Manage Courses</div>
            </div>
            </Button>
            <Button variant="outline" className="h-24" onClick={() => toast.info("Feature coming soon!")}>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div>View Reports</div>
          </div>
            </Button>
            <Button variant="outline" className="h-24" onClick={() => toast.info("Feature coming soon!")}>
              <div className="text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div>Achievements</div>
            </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Admin Panel v2.0</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Welcome to the admin dashboard! This panel provides a comprehensive overview of platform statistics and user activity.
                More advanced features including user management, course creation, and detailed analytics are coming soon.
              </p>
              <Badge variant="secondary">MongoDB Backend</Badge>
              <Badge variant="secondary" className="ml-2">Real-time Updates</Badge>
              <Badge variant="secondary" className="ml-2">Socket.io Enabled</Badge>
                </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
