import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Award, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress, useCourses } from "@/hooks/use-api";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: progressData, isLoading: progressLoading } = useProgress();
  const { data: coursesData, isLoading: coursesLoading } = useCourses();

  const loading = authLoading || progressLoading || coursesLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please login to view your dashboard</p>
      </div>
    );
  }

  const userProgress = progressData?.data || [];
  const courses = coursesData?.data || [];
  const enrolledCourses = userProgress.length;
  const totalXP = user.xp || 0;
  const currentLevel = user.level || 1;
  const levelProgress = totalXP % 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your learning journey!</p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-accent">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Hi, {user.name}!</h2>
              <p className="text-white/90 mt-1">Welcome back to your learning journey</p>
              <p className="text-white/80 text-sm mt-2 capitalize">
                Role: {user.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP}</div>
            <p className="text-xs text-muted-foreground">Keep learning to earn more!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {currentLevel}</div>
            <Progress value={levelProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{levelProgress}% to next level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.badges?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Complete tasks to earn badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Lessons */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg border-l-4 border-secondary">
              <span className="font-medium">Biology 101: Cell Structure</span>
              <span className="text-sm text-muted-foreground">10:00 AM, Wed</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg border-l-4 border-secondary">
              <span className="font-medium">Algebra 2: Quadratic Equations</span>
              <span className="text-sm text-muted-foreground">2:30 PM, Thurs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg border-l-4 border-destructive">
              <span className="font-medium">History Final Exam</span>
              <span className="text-sm text-muted-foreground">Dec 15</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg border-l-4 border-accent">
              <span className="font-medium">English Essay Submission</span>
              <span className="text-sm text-muted-foreground">Nov 30</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommended Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No recommendations yet. Complete an assessment to get started!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
