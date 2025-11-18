import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 2025</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Personal Information</h4>
            <p className="text-sm text-muted-foreground">
              We collect information you provide directly to us, including your name, email address, profile information,
              and any other information you choose to provide when using BYS Academy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Usage Information</h4>
            <p className="text-sm text-muted-foreground">
              We automatically collect information about your interactions with our platform, including courses viewed,
              assessments taken, progress data, and time spent on various activities.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Provide, maintain, and improve our educational services</li>
            <li>Personalize your learning experience and recommendations</li>
            <li>Track your progress and award badges and certificates</li>
            <li>Communicate with you about courses, updates, and announcements</li>
            <li>Ensure the security and integrity of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Information Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>With your consent or at your direction</li>
            <li>With service providers who assist in operating our platform</li>
            <li>To comply with legal obligations or respond to lawful requests</li>
            <li>To protect our rights, privacy, safety, or property</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Data Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Your Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Access and receive a copy of your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our service is intended for users aged 13 and above. We do not knowingly collect personal information from
            children under 13. If you believe we have collected information from a child under 13, please contact us
            immediately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at privacy@bysacademy.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
