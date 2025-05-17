import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Building2, Home, Users, DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function OwnerDashboard() {
  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: "Total Properties",
      value: "12",
      icon: <Building2 className="h-6 w-6" />,
      description: "Your real estate portfolio"
    },
    {
      title: "Active Listings",
      value: "8",
      icon: <Home className="h-6 w-6" />,
      description: "Currently listed properties"
    },
    {
      title: "Total Tenants",
      value: "24",
      icon: <Users className="h-6 w-6" />,
      description: "Active tenants"
    },
    {
      title: "Monthly Revenue",
      value: "$12,500",
      icon: <DollarSign className="h-6 w-6" />,
      description: "Current month's income"
    },
    {
      title: "Property Value",
      value: "$2.5M",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Total portfolio value"
    },
    {
      title: "Upcoming Events",
      value: "5",
      icon: <Calendar className="h-6 w-6" />,
      description: "Maintenance & inspections"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Owner!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your real estate portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="text-blue-600">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Add your recent activity items here */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">New Property Added</p>
                  <p className="text-sm text-gray-500">3-bedroom apartment in Downtown</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Rent Payment Received</p>
                  <p className="text-sm text-gray-500">From John Doe - Apartment 4B</p>
                </div>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Request</p>
                  <p className="text-sm text-gray-500">Plumbing issue - Building C</p>
                </div>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
