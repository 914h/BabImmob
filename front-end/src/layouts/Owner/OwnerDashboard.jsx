import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { NotificationDropdown } from "../../components/ui/notification-dropdown";
import { Building2, Home, Users, DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import StudentOverview from "../ui/OwnerUI/StudentOverview.jsx";
import { StudentMarks } from "../ui/OwnerUI/StudentMarks.jsx";

export default function OwnerDashboard() {
  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: "Total Properties",
      value: "12",
      icon: <Building2 className="h-6 w-6" />,
      description: "Your real estate portfolio",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Active Listings",
      value: "8",
      icon: <Home className="h-6 w-6" />,
      description: "Currently listed properties",
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Total Tenants",
      value: "24",
      icon: <Users className="h-6 w-6" />,
      description: "Active tenants",
      trend: "+3%",
      trendUp: true,
    },
    {
      title: "Monthly Revenue",
      value: "$12,500",
      icon: <DollarSign className="h-6 w-6" />,
      description: "Current month's income",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Property Value",
      value: "$2.5M",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Total portfolio value",
      trend: "+1.2%",
      trendUp: true,
    },
    {
      title: "Upcoming Events",
      value: "5",
      icon: <Calendar className="h-6 w-6" />,
      description: "Maintenance & inspections",
      trend: "0%",
      trendUp: true,
    }
  ];

  const [tab, setTab] = useState("overview");

  return (
    <div className="p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Owner!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Here's an overview of your real estate portfolio</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown />
        </div>
      </div>
      <Tabs defaultValue="overview" value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
          <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    {stat.title}
                  </CardTitle>
                  <div className="text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <span className={`flex items-center text-xs font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                      {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />} {stat.trend}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Chart & Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="mb-2">Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trends for your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentOverview />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="mb-2">Recent Activity</CardTitle>
                <CardDescription>Latest tenants, payments, and property events</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentMarks />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
