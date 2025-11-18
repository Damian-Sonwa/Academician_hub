import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield } from "lucide-react";

export default function PersonalInfo() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Personal Information</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                Role: {user.role}
              </p>
            </div>
          </div>

          {/* Edit Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10"
                />
              </div>
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={user.email}
                disabled
                className="pl-10 bg-muted"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.level || 1}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.xp || 0}</div>
              <div className="text-sm text-muted-foreground">XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.badges?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary capitalize">{user.role}</div>
              <div className="text-sm text-muted-foreground">Role</div>
            </div>
          </div>

          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <Label>Your Badges</Label>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            To change your password or update security settings, please visit the Settings page.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/settings'}>
            Go to Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
