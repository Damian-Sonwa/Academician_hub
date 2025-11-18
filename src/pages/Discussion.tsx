import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RealTimeChat } from "@/components/RealTimeChat";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { MessageSquare, Users, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const discussionRooms = [
  {
    id: "general",
    name: "General Discussion",
    description: "Talk about anything and everything",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "tech",
    name: "Tech Talk",
    description: "Discuss programming and technology",
    icon: Zap,
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "study-group",
    name: "Study Groups",
    description: "Find study partners and collaborate",
    icon: Users,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "ai-help",
    name: "AI & Learning",
    description: "Get help from peers and AI",
    icon: Sparkles,
    color: "from-yellow-500 to-orange-500"
  }
];

export default function Discussion() {
  const { isAuthenticated, user } = useAuth();
  const { onlineUsers, isConnected } = useSocket();
  const [selectedRoom, setSelectedRoom] = useState(discussionRooms[0]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-12 text-center bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-2 border-purple-200">
          <MessageSquare className="w-24 h-24 mx-auto mb-6 text-purple-500 animate-bounce-in" />
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join the Conversation
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Connect with thousands of learners, share knowledge, and grow together in real-time discussions
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
            <Link to="/auth">Sign In to Chat</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-neon-pulse">
            Live Discussions
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time conversations with learners worldwide
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-purple-500 text-purple-600 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            {onlineUsers.length} Online
          </Badge>
          
          {isConnected ? (
            <Badge className="bg-green-500 text-white px-4 py-2">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600 px-4 py-2">
              Connecting...
            </Badge>
          )}
        </div>
      </div>

      {/* User Welcome */}
      <Card className="p-6 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-purple-100/50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-purple-950/30 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg animate-glow">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h2>
            <p className="text-muted-foreground">
              Level {user?.level || 1} • {user?.xp || 0} XP • {user?.badges?.length || 0} Badges
            </p>
          </div>
        </div>
      </Card>

      {/* Room Selection */}
      <div className="grid md:grid-cols-4 gap-4">
        {discussionRooms.map((room) => {
          const Icon = room.icon;
          const isActive = selectedRoom.id === room.id;
          
          return (
            <Card
              key={room.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                isActive
                  ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${room.color} flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">{room.name}</h3>
              <p className="text-sm text-muted-foreground">{room.description}</p>
              
              {isActive && (
                <Badge className="mt-4 bg-purple-500">Active</Badge>
              )}
            </Card>
          );
        })}
      </div>

      {/* Chat Room */}
      <RealTimeChat roomId={selectedRoom.id} roomName={selectedRoom.name} />

      {/* Online Users Sidebar */}
      <Card className="p-6 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Online Users ({onlineUsers.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {onlineUsers.map((onlineUser) => (
            <div key={onlineUser.socketId} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md animate-float">
                {onlineUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-center truncate w-full">{onlineUser.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
