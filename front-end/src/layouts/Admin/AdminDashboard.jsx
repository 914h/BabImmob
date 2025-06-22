import { useUserContext } from "../../context/UserContext.jsx"

import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import {AdminMarks } from "../ui/AdminUI/AdminMarks.jsx"
import AdminOverview from "../ui/AdminUI/AdminOverview.jsx"
import { User2, UserCheck2Icon, Building, FileText, CalendarCheck, Settings, Users, DollarSign } from "lucide-react"
import { Link } from "react-router-dom";
import { ADMIN_MANAGE_USERS_ROUTE, ADMIN_PROPERTIES_ROUTE, ADMIN_TRANSACTIONS_ROUTE } from "../../router";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"

// Mock data for statistics and recent activity
const stats = {
  users: 1280,
  properties: 342,
  contracts: 210,
  visits: 87,
  revenue: 125000,
}

const userAvatars = [
  "/images/backimg.jpg",
  "/images/real-estate-hero.jpg",
  "/src/assets/logo/logoo.png",
  "/src/assets/logo/logo.png",
];
const propertyImages = [
  "/images/real-estate-hero.jpg",
  "/images/backimg.jpg",
  "/src/assets/logo/sidebarimg.png",
];
const latestUsers = [
  { id: 1, name: "Olivia Martin", email: "olivia@email.com", img: userAvatars[0] },
  { id: 2, name: "Jackson Lee", email: "jackson@email.com", img: userAvatars[1] },
  { id: 3, name: "Isabella Nguyen", email: "isabella@email.com", img: userAvatars[2] },
];
const latestProperties = [
  { id: 1, title: "Modern Apartment in Casablanca", location: "Casablanca", img: propertyImages[0] },
  { id: 2, title: "Villa with Pool", location: "Rabat", img: propertyImages[1] },
  { id: 3, title: "Cozy Studio", location: "Marrakech", img: propertyImages[2] },
];

export default function AdminDashboard(){
  const {user} = useUserContext()
    return <>
<div className="w-full max-w-full p-2 bg-white dark:bg-gray-900 shadow-md rounded-lg max-h-[90vh] overflow-hidden flex flex-col justify-between">
  {/* <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">ID</th>
        <th scope="col" className="px-6 py-3">Prenom</th>
        <th scope="col" className="px-6 py-3">Nom</th>
        <th scope="col" className="px-6 py-3">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {user.id}
        </th>
        <td className="px-6 py-4">{user.prenom}</td>
        <td className="px-6 py-4">{user.nom}</td>
        <td className="px-6 py-4">{user.email}</td>
      </tr>
    </tbody>
  </table> */}
      <div className="flex flex-col gap-6 p-6 h-full">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          {/* Removed More Info Button */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* Kept other triggers for now, can be updated later */}
            <TabsTrigger value="analytics" disabled>
              Events
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Annoucments
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Finance
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {/* User Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-primary-modern" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users}</div>
                  <CardDescription>Registered users</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                  <Building className="h-5 w-5 text-primary-modern" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.properties}</div>
                  <CardDescription>Listed properties</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                  <FileText className="h-5 w-5 text-primary-modern" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.contracts}</div>
                  <CardDescription>Active contracts</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <CalendarCheck className="h-5 w-5 text-primary-modern" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.visits}</div>
                  <CardDescription>Scheduled visits</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 text-primary-modern" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} €</div>
                  <CardDescription>Revenue generated</CardDescription>
                </CardContent>
              </Card>
            </div>
            {/* Keeping existing overview and transactions components below the new cards for now */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className="mb-6">Overview</CardTitle>
                  <AdminOverview />
                </CardHeader>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="mb-6">Recent Admin Actions</CardTitle>
                  <CardDescription>Latest activities performed by admins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-modern scrollbar-track-background rounded-md pr-2">
                    <ul className="divide-y divide-border">
                      {[
                        { icon: <Users className="h-5 w-5 text-primary-modern" />, text: 'Added new user Olivia Martin', time: '2 min ago' },
                        { icon: <Building className="h-5 w-5 text-primary-modern" />, text: 'Approved property "Modern Apartment"', time: '10 min ago' },
                        { icon: <FileText className="h-5 w-5 text-primary-modern" />, text: 'Signed contract with client', time: '30 min ago' },
                        { icon: <CalendarCheck className="h-5 w-5 text-primary-modern" />, text: 'Scheduled a visit for Villa with Pool', time: '1 hour ago' },
                        { icon: <Users className="h-5 w-5 text-primary-modern" />, text: 'Updated user permissions', time: '2 hours ago' },
                        { icon: <Building className="h-5 w-5 text-primary-modern" />, text: 'Added new property "Cozy Studio"', time: '3 hours ago' },
                        { icon: <FileText className="h-5 w-5 text-primary-modern" />, text: 'Renewed contract for client Jackson Lee', time: '4 hours ago' },
                        { icon: <CalendarCheck className="h-5 w-5 text-primary-modern" />, text: 'Visit completed for "Villa with Pool"', time: '5 hours ago' },
                        { icon: <Users className="h-5 w-5 text-primary-modern" />, text: 'Removed user Sofia Davis', time: '6 hours ago' },
                        { icon: <Building className="h-5 w-5 text-primary-modern" />, text: 'Updated property details for "Modern Apartment"', time: '7 hours ago' },
                        { icon: <FileText className="h-5 w-5 text-primary-modern" />, text: 'Contract terminated for client Isabella Nguyen', time: '8 hours ago' },
                        { icon: <CalendarCheck className="h-5 w-5 text-primary-modern" />, text: 'Scheduled visit for "Cozy Studio"', time: '9 hours ago' },
                        { icon: <Users className="h-5 w-5 text-primary-modern" />, text: 'Changed admin password', time: '10 hours ago' },
                        { icon: <Building className="h-5 w-5 text-primary-modern" />, text: 'Property "Villa with Pool" marked as sold', time: '11 hours ago' },
                        { icon: <FileText className="h-5 w-5 text-primary-modern" />, text: 'Drafted new contract for client', time: '12 hours ago' },
                        { icon: <CalendarCheck className="h-5 w-5 text-primary-modern" />, text: 'Visit cancelled for "Modern Apartment"', time: '13 hours ago' },
                      ].map((action, idx) => (
                        <li key={idx} className="flex items-center gap-3 py-3">
                          <div>{action.icon}</div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-primary-modern">{action.text}</span>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{action.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
</div>    </>
}
