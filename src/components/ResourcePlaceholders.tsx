import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, Download, Play } from "lucide-react";

export default function ResourcePlaceholders() {
  const placeholderBooks = [
    {
      id: 1,
      title: "Introduction to Mathematics",
      description: "Comprehensive guide covering fundamental mathematical concepts",
      category: "Mathematics",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      description: "Essential physics principles and practical applications",
      category: "Physics",
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Chemistry Essentials",
      description: "Complete guide to chemical reactions and compounds",
      category: "Chemistry",
      thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop",
    },
  ];

  const placeholderVideos = [
    {
      id: 1,
      title: "Algebra Basics Tutorial",
      description: "Step-by-step walkthrough of algebraic equations",
      category: "Mathematics",
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Quantum Mechanics Explained",
      description: "Understanding quantum physics in simple terms",
      category: "Physics",
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Organic Chemistry Lab",
      description: "Hands-on demonstrations of organic reactions",
      category: "Chemistry",
      thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Textbooks Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Textbooks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{book.title}</CardTitle>
                  <Badge variant="secondary">{book.category}</Badge>
                </div>
                <CardDescription>{book.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" variant="default">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Video className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Video Tutorials</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden relative group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{video.title}</CardTitle>
                  <Badge variant="secondary">{video.category}</Badge>
                </div>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button className="flex-1" variant="default">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
                <Button className="flex-1" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
