import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Subscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [fetchingPlan, setFetchingPlan] = useState(true);

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await apiClient.getCurrentSubscription();
      setCurrentSubscription(response.data);
    } catch (error: any) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setFetchingPlan(false);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₦0",
      period: "forever",
      icon: Sparkles,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      features: [
        "Access to basic courses",
        "3 quizzes per month",
        "Community discussions",
        "Basic progress tracking",
        "AI Assistant (limited)",
      ],
      limitations: [
        "No premium courses",
        "Limited quiz attempts",
        "No certificates",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₦5,000",
      period: "/month",
      icon: Crown,
      color: "text-primary",
      bgColor: "bg-primary/10",
      popular: true,
      features: [
        "All free features",
        "Access to all premium courses",
        "Unlimited quiz attempts",
        "Download certificates",
        "Advanced AI Assistant",
        "Priority support",
        "Ad-free experience",
        "Early access to new content",
      ],
      limitations: [],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₦12,000",
      period: "/month",
      icon: Zap,
      color: "text-accent",
      bgColor: "bg-accent/10",
      features: [
        "All premium features",
        "1-on-1 tutoring sessions (2/month)",
        "Custom learning paths",
        "Advanced analytics",
        "API access",
        "Team collaboration tools",
        "Dedicated account manager",
        "White-label certificates",
      ],
      limitations: [],
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;
    
    setLoading(planId);
    
    try {
      const response = await apiClient.upgradeSubscription(planId, 'card');
      toast.success(response.message || 'Subscription upgraded successfully!', {
        description: `You now have access to all ${planId} features.`,
      });
      await fetchCurrentSubscription();
    } catch (error: any) {
      toast.error('Subscription failed', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await apiClient.cancelSubscription();
      toast.success(response.message || 'Subscription cancelled successfully');
      await fetchCurrentSubscription();
    } catch (error: any) {
      toast.error('Failed to cancel subscription', {
        description: error.message,
      });
    }
  };

  if (fetchingPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlan = currentSubscription?.plan || 'free';

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock your learning potential with our flexible subscription plans. Upgrade or downgrade anytime.
        </p>
        {currentSubscription && (
          <Badge className="mt-4 text-lg px-4 py-2 bg-primary">
            Current Plan: {currentSubscription.plan.toUpperCase()}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <div className={`mx-auto p-3 rounded-full ${plan.bgColor} w-fit mb-4`}>
                  <Icon className={`h-8 w-8 ${plan.color}`} />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : currentPlan === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Enterprise Solutions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Need custom solutions for your organization? We offer tailored plans for schools, universities, and
                businesses with volume discounts and dedicated support.
              </p>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
      </div>
    </div>
  );
}
