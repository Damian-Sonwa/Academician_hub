import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Sparkles, Trophy, Users, BookOpen, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useHealthCheck } from "@/hooks/use-api";

const Index = () => {
  const { data: healthData, isSuccess } = useHealthCheck();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Connection Status Badge */}
        <div className="fixed top-4 right-4 z-50">
          {isSuccess && healthData ? (
            <Badge variant="outline" className="bg-green-500/20 text-green-100 border-green-400 backdrop-blur-md shadow-lg shadow-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Live & Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-100 border-yellow-400 backdrop-blur-md">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              Connecting...
            </Badge>
          )}
        </div>

        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-full animate-pulse-glow backdrop-blur-xl border-2 border-purple-400/30">
              <GraduationCap className="h-24 w-24 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-float" />
            </div>
          </div>

          <div className="overflow-hidden">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-marquee whitespace-nowrap inline-block">
              Learn Fast, Achieve More...
            </h1>
          </div>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95">
            Welcome to Bright Young-stars Academy, the platform designed for ambitious learners. Experience personalized AI-driven learning, interactive gamification, and a community built to help you master any subject.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              <Link to="/dashboard">Begin Your Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 rounded-full"
            >
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-accent group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Rich Content Library</h3>
              <p className="opacity-90">Access 1000+ courses across technology, business, design, and more with HD video lessons and interactive materials.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-accent group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Gamified Learning</h3>
              <p className="opacity-90">Earn XP points, unlock achievements, compete on leaderboards, and collect rare NFT badges as you master skills.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 text-accent group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Assistance</h3>
              <p className="opacity-90">Get 24/7 personalized tutoring, smart recommendations, automated assessments, and adaptive learning paths.</p>
            </div>
          </div>

          {/* Additional Unique Features */}
          <div className="mt-16 bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Why Choose Bright Young-stars Academy?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Real-Time Collaboration</h4>
                  <p className="text-sm opacity-90">Study groups, live coding sessions, and peer-to-peer learning in virtual classrooms.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Global Community</h4>
                  <p className="text-sm opacity-90">Connect with 100,000+ learners worldwide, join discussions, and build your network.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Industry Certifications</h4>
                  <p className="text-sm opacity-90">Earn recognized certificates and digital credentials that boost your career.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Personalized Journey</h4>
                  <p className="text-sm opacity-90">AI creates custom learning paths based on your goals, pace, and learning style.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/20 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link to="/privacy" className="text-white/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/80 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/subscription" className="text-white/80 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>
          <p className="text-white/60 text-sm">
            © 2025 BYS Academy. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
