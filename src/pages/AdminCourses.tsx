import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Lock, Users, Clock, Search, Filter, Shield, Play, CheckCircle, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useCourses } from "@/hooks/use-api";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/integrations/api/client";
import { getSubjectImage } from "@/lib/utils";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  isPremium: boolean;
  instructor: string;
  duration: string;
  level: string;
  enrolled: number;
  imageUrl?: string;
}

export default function AdminCourses() {
  const { user } = useAuth();
  const { data: coursesData, isLoading: loading } = useCourses();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [enrolling, setEnrolling] = useState<string | null>(null);

  // Check admin access
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const allCourses: Course[] = coursesData?.data || [];

  const categories = [
    { value: "all", label: "All Categories", icon: "📚" },
    { value: "science", label: "Science", icon: "🧪" },
    { value: "math", label: "Mathematics", icon: "📐" },
    { value: "english", label: "Arts & Humanities", icon: "📖" },
    { value: "history", label: "History", icon: "📜" },
    { value: "geography", label: "Geography", icon: "🌍" },
    { value: "webdev", label: "Web Development", icon: "💻" },
    { value: "languages", label: "Languages", icon: "🌐" },
    { value: "cybersecurity", label: "Cybersecurity", icon: "🔒" },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Junior", label: "Junior" },
    { value: "Secondary", label: "Secondary" },
    { value: "Advanced", label: "Advanced" },
  ];

  // Filter courses - Remove Biology Junior courses
  const filteredCourses = allCourses.filter((course) => {
    // Remove Junior level from Biology courses (check title since category is 'science')
    const isBiologyJunior = (course.title?.toLowerCase().includes('biology') || course.category?.toLowerCase() === 'biology') && course.level === 'Junior';
    if (isBiologyJunior) {
      return false;
    }
    
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = async (course: Course) => {
    try {
      setEnrolling(course._id);
      // Extract subject and level from course
      const subject = course.category;
      const level = course.level;
      
      const response = await apiClient.enrollInCourse(subject, level);
      toast.success(response.message || 'Successfully enrolled!');
    } catch (error: any) {
      if (error.message?.includes('Already enrolled')) {
        toast.info("Already enrolled in this course");
      } else {
        toast.error(error.message || 'Failed to enroll in course');
      }
    } finally {
      setEnrolling(null);
    }
  };

  const handleViewCourse = (course: Course) => {
    // Navigate to course page - admins can access all courses
    const subject = course.category;
    const level = course.level;
    navigate(`/courses/${subject}/${level}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Full access to all courses without subscription restrictions
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Admin Access
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <GraduationCap className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative">
                {(() => {
                  const imageUrl = getSubjectImage(course);
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center rounded-t-lg">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  );
                })()}
                <div className="absolute top-2 right-2 flex gap-2">
                  {course.isPremium && (
                    <Badge className="bg-amber-500 text-white">
                      Premium
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-primary/80 text-white">
                    Admin
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Instructor: </span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => handleViewCourse(course)}
                  className="flex-1"
                  variant="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  View Course
                </Button>
                <Button
                  onClick={() => handleEnroll(course)}
                  className="flex-1"
                  variant="outline"
                  disabled={enrolling === course._id}
                >
                  {enrolling === course._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enroll
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Admin Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Administrator Access</h3>
              <p className="text-sm text-muted-foreground">
                As an administrator, you have full access to all courses including premium content without any subscription restrictions. 
                You can enroll in any course and access all materials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

