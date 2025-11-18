import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Settings, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              This page is only accessible to administrators
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Admin & Security
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage security settings and administrative functions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your account security settings, password, and authentication methods.
            </p>
            <Button onClick={() => navigate('/settings')} className="w-full">
              Open Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View and manage user accounts, roles, and permissions.
            </p>
            <Button 
              onClick={() => toast.info("Feature coming soon!")} 
              variant="outline" 
              className="w-full"
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create, edit, and manage courses, lessons, and educational content.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => navigate('/admin-panel')} 
                className="w-full"
              >
                Admin Panel
              </Button>
              <Button 
                onClick={() => navigate('/admin/courses')} 
                variant="outline"
                className="w-full"
              >
                Admin Courses (Full Access)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Monitor system security, view logs, and manage access controls.
            </p>
            <Button 
              onClick={() => toast.info("Feature coming soon!")} 
              variant="outline" 
              className="w-full"
            >
              Security Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Administrator Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have full administrative access to the platform. Use these tools responsibly to manage 
                users, content, and system settings. All actions are logged for security purposes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/admin-panel')}>
                  Full Admin Panel
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/settings')}>
                  Settings
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Analytics coming soon!")}>
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
