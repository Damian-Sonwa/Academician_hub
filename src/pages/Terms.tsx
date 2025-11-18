import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: January 2025</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            By accessing and using BYS Academy, you accept and agree to be bound by these Terms of Service and our
            Privacy Policy. If you do not agree to these terms, please do not use our platform.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Account Creation</h4>
            <p className="text-sm text-muted-foreground">
              You must create an account to access most features of BYS Academy. You agree to provide accurate, current,
              and complete information during registration and to update your information as necessary.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Account Security</h4>
            <p className="text-sm text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. Notify us immediately of any unauthorized use.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. User Conduct</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Use the platform for any unlawful purpose</li>
            <li>Post or transmit harmful, offensive, or inappropriate content</li>
            <li>Attempt to gain unauthorized access to any part of the platform</li>
            <li>Interfere with or disrupt the platform's functionality</li>
            <li>Use automated systems to access the platform without permission</li>
            <li>Share copyrighted materials without proper authorization</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Subscription and Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Premium Plans</h4>
            <p className="text-sm text-muted-foreground">
              Some features of BYS Academy require a paid subscription. You agree to pay all fees associated with your
              chosen subscription plan.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Billing</h4>
            <p className="text-sm text-muted-foreground">
              Subscriptions automatically renew unless canceled before the renewal date. We reserve the right to change
              our fees with advance notice.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Refunds</h4>
            <p className="text-sm text-muted-foreground">
              Refunds are handled on a case-by-case basis. Please contact our support team if you have concerns about
              billing.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All content on BYS Academy, including courses, assessments, text, graphics, logos, and software, is the
            property of BYS Academy or its content suppliers and is protected by copyright and other intellectual
            property laws. You may not reproduce, distribute, or create derivative works without permission.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Certificates and Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Certificates and badges earned on BYS Academy represent completion of courses and assessments within our
            platform. They are issued by BYS Academy and do not constitute official academic credentials unless
            explicitly stated.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Disclaimer of Warranties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            BYS Academy is provided "as is" without warranties of any kind, either express or implied. We do not
            guarantee that the platform will be uninterrupted, error-free, or free from viruses or other harmful
            components.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To the fullest extent permitted by law, BYS Academy shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising out of your use of the platform.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We reserve the right to modify these Terms of Service at any time. We will notify users of significant
            changes via email or platform notification. Continued use of the platform after changes constitutes
            acceptance of the modified terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For questions about these Terms of Service, please contact us at legal@bysacademy.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
