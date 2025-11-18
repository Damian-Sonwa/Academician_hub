import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Medal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress, useCourses } from "@/hooks/use-api";

export default function ProgressPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: progressData, isLoading: progressLoading } = useProgress();
  const { data: coursesData, isLoading: coursesLoading } = useCourses();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please login to view your progress</p>
      </div>
    );
  }

  if (progressLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userProgress = progressData?.data || [];
  const allCourses = coursesData?.data || [];
  
  // Map progress to courses
  const coursesWithProgress = userProgress.map((prog: any) => {
    const course = allCourses.find((c: any) => c._id === prog.courseId);
    return {
      name: course?.title || 'Unknown Course',
      progress: prog.completionPercentage || 0,
      points: prog.xpEarned || 0,
      courseId: prog.courseId,
    };
  });

  const totalPoints = user.xp || 0;
  const completedCourses = coursesWithProgress.filter((c: any) => c.progress === 100).length;

  // Convert user badges to badge objects
  const userBadges = user.badges || [];
  const badges = [
    { name: "First Quiz", icon: <Star className="h-8 w-8 text-yellow-500" />, earned: userBadges.includes("First Quiz") || userBadges.length > 0 },
    { name: "5 Quizzes", icon: <Trophy className="h-8 w-8 text-yellow-600" />, earned: userBadges.includes("5 Quizzes") },
    { name: "Math Expert", icon: <Medal className="h-8 w-8 text-blue-500" />, earned: userBadges.includes("Math Expert") },
    { name: "Science Pro", icon: <Award className="h-8 w-8 text-green-500" />, earned: userBadges.includes("Science Pro") },
  ];

  const rewards = [
    { name: "Quiz Master Badge", points: 100, icon: "🏆" },
    { name: "Rocket Learner Badge", points: 250, icon: "🚀" },
    { name: "Master Scholar Badge", points: 500, icon: "🎓" },
  ];

  const redeemReward = (name: string, points: number) => {
    if (totalPoints >= points) {
      toast.success(`${name} redeemed for ${points} points! 🎉`, {
        description: "Congratulations! Your badge has been added to your profile.",
      });
    } else {
      toast.error(`Not enough points!`, {
        description: `You need ${points - totalPoints} more points to redeem this badge.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Your Learning Progress</h1>
        <p className="text-muted-foreground mt-1">Track your progress and see how far you've come</p>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              </div>
              <Sparkles className="h-12 w-12 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
                <p className="text-3xl font-bold text-primary">{completedCourses}</p>
              </div>
              <Trophy className="h-12 w-12 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold text-primary">{badges.filter(b => b.earned).length}/{badges.length}</p>
              </div>
              <Medal className="h-12 w-12 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Course Progress</h2>
        {coursesWithProgress.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No course progress yet. Start a course to see your progress here!</p>
            </CardContent>
          </Card>
        ) : (
          coursesWithProgress.map((course: any, index: number) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {course.points} XP
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={course.progress} className="h-3" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Badges */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  badge.earned
                    ? "bg-gradient-to-br from-accent/20 to-accent/10 border-accent animate-pulse-glow"
                    : "bg-muted/50 border-muted opacity-50 hover:opacity-70"
                }`}
              >
                <div className="mb-2">{badge.icon}</div>
                <p className="text-sm font-medium text-center">{badge.name}</p>
                {badge.earned && <p className="text-xs text-accent mt-1 font-semibold">Earned! ✨</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Available Rewards</CardTitle>
          <p className="text-sm text-muted-foreground">
            Earn more points to unlock these badges! You have {totalPoints} points.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="text-4xl">{reward.icon}</div>
                  <h3 className="font-semibold">{reward.name}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Cost: {reward.points} Points</p>
                    {totalPoints >= reward.points ? (
                      <Badge className="bg-secondary text-secondary-foreground">Available!</Badge>
                    ) : (
                      <Badge variant="outline">{reward.points - totalPoints} pts needed</Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => redeemReward(reward.name, reward.points)}
                    className="w-full hover:shadow-md transition-all"
                    disabled={totalPoints < reward.points}
                  >
                    Redeem
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
