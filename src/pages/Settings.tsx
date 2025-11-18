import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Bell, Shield, Palette, Globe, Loader2 } from "lucide-react";
import { apiClient } from "@/integrations/api/client";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile settings
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [achievements, setAchievements] = useState(true);

  // Appearance settings
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");

  const handleProfileUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name });
      toast.success("Profile updated successfully! ✨");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await apiClient.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully! 🔒");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationSave = () => {
    toast.success("Notification preferences saved! 🔔");
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    // Apply theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast.success(`Theme changed to ${newTheme}! 🎨`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="h-4 w-4 mr-2" />
            Language
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  placeholder="your@email.com"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Account Level</Label>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-primary">
                    Level {user?.level || 1}
                  </div>
                  <div className="text-muted-foreground">
                    {user?.xp || 0} XP
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Badges Earned</Label>
                <div className="flex flex-wrap gap-2">
                  {user?.badges?.map((badge, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is secure by using a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Enable 2FA (Coming Soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Course Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new lessons and content
                  </p>
                </div>
                <Switch
                  checked={courseUpdates}
                  onCheckedChange={setCourseUpdates}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Achievement Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you unlock achievements
                  </p>
                </div>
                <Switch
                  checked={achievements}
                  onCheckedChange={setAchievements}
                />
              </div>

              <Button onClick={handleNotificationSave}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose your preferred theme for the interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => handleThemeChange("light")}
                  className="h-24"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">☀️</div>
                    <div>Light</div>
                  </div>
                </Button>

                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => handleThemeChange("dark")}
                  className="h-24"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌙</div>
                    <div>Dark</div>
                  </div>
                </Button>

                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => handleThemeChange("system")}
                  className="h-24"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">💻</div>
                    <div>System</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>
                Select your preferred language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                  >
                    🇺🇸 English
                  </Button>
                  <Button
                    variant={language === "es" ? "default" : "outline"}
                    onClick={() => setLanguage("es")}
                  >
                    🇪🇸 Español
                  </Button>
                  <Button
                    variant={language === "fr" ? "default" : "outline"}
                    onClick={() => setLanguage("fr")}
                  >
                    🇫🇷 Français
                  </Button>
                  <Button
                    variant={language === "de" ? "default" : "outline"}
                    onClick={() => setLanguage("de")}
                  >
                    🇩🇪 Deutsch
                  </Button>
                </div>
              </div>

              <Separator />

              <p className="text-sm text-muted-foreground">
                More languages coming soon! Language settings will apply to the interface and content.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

