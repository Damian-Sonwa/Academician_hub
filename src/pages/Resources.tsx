import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Download, Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Resources() {
  const { user, isAuthenticated } = useAuth();

  const sampleResources = [
    {
      id: 1,
      title: "Introduction to Biology - Study Guide",
      type: "PDF",
      category: "Science",
      description: "Comprehensive study guide covering cell biology fundamentals",
      isPremium: false,
      size: "2.5 MB",
      icon: FileText,
    },
    {
      id: 2,
      title: "Advanced Mathematics - Video Lecture Series",
      type: "Video",
      category: "Mathematics",
      description: "12-part video series on calculus and linear algebra",
      isPremium: true,
      duration: "8 hours",
      icon: Video,
    },
    {
      id: 3,
      title: "Python Programming - Complete eBook",
      type: "PDF",
      category: "Programming",
      description: "From basics to advanced concepts with code examples",
      isPremium: false,
      size: "15 MB",
      icon: BookOpen,
    },
    {
      id: 4,
      title: "Web Development Masterclass",
      type: "Video",
      category: "Programming",
      description: "Full-stack development with React and Node.js",
      isPremium: true,
      duration: "20 hours",
      icon: Video,
    },
    {
      id: 5,
      title: "Chemistry Lab Manual",
      type: "PDF",
      category: "Science",
      description: "Practical laboratory experiments and procedures",
      isPremium: false,
      size: "5 MB",
      icon: FileText,
    },
  ];

  const handleDownload = (resource: any) => {
    if (resource.isPremium && user?.role !== 'premium' && user?.role !== 'admin') {
      toast.info("Premium Resource", {
        description: "Upgrade to premium to access this resource",
      });
      return;
    }

    toast.success(`Downloading ${resource.title}...`, {
      description: "Your download will begin shortly",
    });
  };

  const handleView = (resource: any) => {
    if (resource.isPremium && user?.role !== 'premium' && user?.role !== 'admin') {
      toast.info("Premium Resource", {
        description: "Upgrade to premium to access this resource",
      });
      return;
    }

    toast.info(`Opening ${resource.title}...`);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Resources Library</h2>
            <p className="text-muted-foreground">
              Please login to access educational resources
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Educational Resources</h1>
        <p className="text-muted-foreground mt-1">
          Access study materials, videos, and more
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="pdf">PDFs</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {sampleResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        resource.type === 'Video' ? 'bg-blue-500/10' : 'bg-green-500/10'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          resource.type === 'Video' ? 'text-blue-500' : 'text-green-500'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary">{resource.category}</Badge>
                              <Badge variant="outline">{resource.type}</Badge>
                              {resource.isPremium && (
                                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {resource.size || resource.duration}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(resource)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownload(resource)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {sampleResources
              .filter((r) => r.type === "PDF")
              .map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                          <Icon className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{resource.category}</Badge>
                            <span className="text-xs text-muted-foreground">{resource.size}</span>
                          </div>
                        </div>
                        <Button onClick={() => handleDownload(resource)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {sampleResources
              .filter((r) => r.type === "Video")
              .map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-blue-500/10">
                          <Icon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{resource.category}</Badge>
                            {resource.isPremium && (
                              <Badge className="bg-yellow-500/10 text-yellow-600">
                                <Lock className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{resource.duration}</span>
                          </div>
                        </div>
                        <Button onClick={() => handleView(resource)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
