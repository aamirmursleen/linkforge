import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Globe,
  Key,
  Bell,
  Shield,
  CreditCard,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <AppHeader title="Settings" />

      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--muted)]" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xl font-semibold">
                JD
              </div>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input defaultValue="John" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input defaultValue="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" defaultValue="john@example.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Custom Domain */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Custom Domain</CardTitle>
              </div>
              <Badge>Pro Feature</Badge>
            </div>
            <CardDescription>
              Use your own domain for branded short links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Domain</label>
              <div className="flex gap-2">
                <Input placeholder="links.yourdomain.com" />
                <Button>Add Domain</Button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--primary-pale)] text-sm">
              <p className="font-medium text-[var(--dark)] mb-1">
                How to set up your custom domain
              </p>
              <p className="text-[var(--muted)]">
                Add a CNAME record pointing to <code className="bg-white px-1 rounded">cname.linkforge.com</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-[var(--muted)]" />
              <CardTitle>API Keys</CardTitle>
            </div>
            <CardDescription>
              Manage your API keys for integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
              <div>
                <p className="font-medium">Production Key</p>
                <p className="text-sm text-[var(--muted)]">lf_live_••••••••••••1234</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Copy</Button>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
            </div>
            <Button variant="outline">Create New Key</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[var(--muted)]" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Email notifications", description: "Receive updates via email" },
              { label: "Weekly reports", description: "Get weekly performance summaries" },
              { label: "Link alerts", description: "Notify when links reach milestones" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-[var(--muted)]">{item.description}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--muted)]" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-sm text-[var(--muted)]">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change password</p>
                <p className="text-sm text-[var(--muted)]">Update your password regularly</p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[var(--muted)]" />
              <CardTitle>Billing</CardTitle>
            </div>
            <CardDescription>
              Manage your subscription and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--primary-pale)]">
              <div>
                <p className="font-medium text-[var(--dark)]">Free Plan</p>
                <p className="text-sm text-[var(--muted)]">5 links/month • 2 QR codes/month</p>
              </div>
              <Button>Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete account</p>
                <p className="text-sm text-[var(--muted)]">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
