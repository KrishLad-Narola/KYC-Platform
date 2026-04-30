import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Key, CreditCard, Bell, Shield, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '../api/apiService';
import { planLimits } from '../api/mockData';

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const [apiKey, setApiKey] = useState(user?.organization?.apiKey || 'sk_test_xxxxxxxxxxxx');
  const [notifications, setNotifications] = useState({
    emailOnUpload: true,
    emailOnApproval: true,
    emailOnRejection: true,
    weeklyReport: true
  });

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  const handleRegenerateApiKey = async () => {
    try {
      const response = await apiService.regenerateApiKey(user.organizationId);
      if (response.success) {
        setApiKey(response.apiKey);
        toast.success('API key regenerated successfully');
      }
    } catch (error) {
      toast.error('Failed to regenerate API key');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const currentPlan = user?.organization?.plan || 'pro';
  const planDetails = planLimits[currentPlan];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and organization settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user?.role} disabled />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Manage your organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue={user?.organization?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Organization ID</Label>
                  <Input value={user?.organizationId} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-sm py-1 px-3">
                      {planDetails?.name.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Members</Label>
                  <Input value="5 / 50" disabled />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Documents Uploaded
                      </span>
                      <span className="text-sm font-medium">
                        234 / {planDetails?.uploadLimit === -1 ? '∞' : planDetails?.uploadLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: planDetails?.uploadLimit === -1 ? '50%' : '23.4%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Storage Used
                      </span>
                      <span className="text-sm font-medium">
                        2.3 GB / {planDetails?.storage}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Keep your API keys secure. Never share them publicly or commit them to version control.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Production API Key</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input value={apiKey} type="password" disabled className="font-mono" />
                    <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleRegenerateApiKey}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Use this key to authenticate API requests
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">API Documentation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Base URL: <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      https://api.kycmanager.com/v1
                    </code>
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline">POST</Badge>
                      <code className="flex-1">/documents/upload</code>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <code className="flex-1">/documents</code>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <code className="flex-1">/documents/:id</code>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge variant="outline">PATCH</Badge>
                      <code className="flex-1">/documents/:id/status</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{planDetails?.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ${planDetails?.price}/month
                    </p>
                  </div>
                  <Button>Upgrade Plan</Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Plan Features:</h4>
                  <ul className="space-y-2">
                    {planDetails?.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="h-1.5 w-1.5 bg-green-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(planLimits).map(([key, plan]) => (
                    <div
                      key={key}
                      className={`p-6 border rounded-lg ${
                        key === currentPlan
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-3xl font-bold mb-4">
                        ${plan.price}
                        <span className="text-sm text-gray-600 dark:text-gray-400">/mo</span>
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="text-sm">
                          {plan.uploadLimit === -1 ? 'Unlimited' : plan.uploadLimit} uploads
                        </li>
                        <li className="text-sm">{plan.storage} storage</li>
                        <li className="text-sm">{plan.support} support</li>
                      </ul>
                      <Button
                        className="w-full"
                        variant={key === currentPlan ? 'outline' : 'default'}
                        disabled={key === currentPlan}
                      >
                        {key === currentPlan ? 'Current Plan' : 'Upgrade'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email on Document Upload</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when a new document is uploaded
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailOnUpload}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailOnUpload: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email on Document Approval</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when a document is approved
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailOnApproval}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailOnApproval: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email on Document Rejection</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when a document is rejected
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailOnRejection}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailOnRejection: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Report</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive a weekly summary of your KYC activities
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReport: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
