import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Learning Assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("course") || lowerQuestion.includes("learn")) {
      return "I recommend exploring our Mathematics and Science courses. They're great for building foundational skills. Would you like me to guide you to the Courses section?";
    }
    if (lowerQuestion.includes("quiz") || lowerQuestion.includes("test")) {
      return "You can take quizzes within each course! Each course has its own assessments tab with quizzes and assignments. Enroll in a course to access its assessments.";
    }
    if (lowerQuestion.includes("progress") || lowerQuestion.includes("score")) {
      return "You can track your learning progress in the Progress section. It shows your course completion, badges earned, and available rewards!";
    }
    if (lowerQuestion.includes("badge") || lowerQuestion.includes("reward")) {
      return "Badges are earned by completing courses and scoring well on course assessments. Check the Progress section to see your achievements and available rewards!";
    }
    
    return "That's a great question! I'm here to help you with course recommendations, quiz preparation, progress tracking, and general learning guidance. What would you like to know more about?";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🤖 AI Learning Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your learning..."
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
