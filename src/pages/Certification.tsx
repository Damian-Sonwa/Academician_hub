import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, FileText, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Certification() {
  const projects = [
    {
      id: 1,
      title: "Mathematics Final Project",
      description: "Complete a comprehensive mathematics project demonstrating mastery of algebra, calculus, and statistics",
      status: "available",
      points: 500,
    },
    {
      id: 2,
      title: "Science Research Paper",
      description: "Write and submit a research paper on a scientific topic of your choice",
      status: "in-progress",
      points: 750,
    },
    {
      id: 3,
      title: "History Documentary Project",
      description: "Create a documentary presentation on a significant historical event",
      status: "locked",
      points: 600,
    },
  ];

  const certifications = [
    {
      id: 1,
      title: "Mathematics Excellence Certificate",
      description: "Awarded for completing all mathematics courses with 90% or higher",
      earned: true,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Science Fundamentals Certificate",
      description: "Complete all basic science courses and assessments",
      earned: false,
      progress: 75,
    },
    {
      id: 3,
      title: "Master Learner Certificate",
      description: "Complete 10 courses across different categories with distinction",
      earned: false,
      progress: 40,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Final Projects & Certification</h1>
        <p className="text-muted-foreground">
          Complete final projects and earn certificates to showcase your achievements
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Final Projects</h2>
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge
                        variant={
                          project.status === "available"
                            ? "default"
                            : project.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{project.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {project.status === "available" && (
                    <Button>
                      <FileText className="mr-2 h-4 w-4" />
                      View Requirements
                    </Button>
                  )}
                  {project.status === "in-progress" && (
                    <>
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Submission
                      </Button>
                      <Button variant="outline">View Draft</Button>
                    </>
                  )}
                  {project.status === "locked" && (
                    <Button variant="outline" disabled>
                      Complete Prerequisites First
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Certificates</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className={cert.earned ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${cert.earned ? "bg-primary/10" : "bg-muted"}`}>
                    <Award className={`h-6 w-6 ${cert.earned ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {cert.title}
                      {cert.earned && <CheckCircle className="h-5 w-5 text-primary" />}
                    </CardTitle>
                    {cert.earned && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned on {new Date(cert.date!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                {cert.earned ? (
                  <Button variant="outline" className="w-full">
                    Download Certificate
                  </Button>
                ) : (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
