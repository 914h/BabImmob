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
import { User2, UserCheck2Icon, Building, CreditCard, Settings } from "lucide-react"
import { Link } from "react-router-dom";
import { ADMIN_MANAGE_USERS_ROUTE, ADMIN_PROPERTIES_ROUTE, ADMIN_TRANSACTIONS_ROUTE } from "../../router";

export default function AdminDashboard(){
  const {user} = useUserContext()
    return <>
<div className="relative overflow-x-auto w-full max-w-full p-2 bg-white dark:bg-gray-900 shadow-md rounded-lg">
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
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* User Management Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      User Management
                    </CardTitle>
                   <User2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Manage user accounts and roles
                    </CardDescription>
                    <Link to={ADMIN_MANAGE_USERS_ROUTE}>
                      <Button size="sm" className="w-full">Manage Users</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Properties Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Properties
                    </CardTitle>
                   <Building className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="mb-4">
                      Add and manage properties
                    </CardDescription>
                    <Link to={ADMIN_PROPERTIES_ROUTE}>
                       <Button size="sm" className="w-full">Manage Properties</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Financial Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Financial</CardTitle>
                     <CreditCard className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="mb-4">
                      Track payments and revenue
                    </CardDescription>
                    <Link to={ADMIN_TRANSACTIONS_ROUTE}> {/* Linking to transactions as a placeholder for Finances */}
                      <Button size="sm" className="w-full">View Finances</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* System Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      System
                    </CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="mb-4">
                      System settings and backup
                    </CardDescription>
                    {/* Placeholder button for system action */}
                    <Button size="sm" className="w-full" onClick={() => console.log('Create Backup clicked')}>Create Backup</Button>
                  </CardContent>
                </Card>
              </div>
              {/* Keeping existing overview and transactions components below the new cards for now */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="mb-6">Overview</CardTitle>
                    <AdminOverview/>
                  </CardHeader>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle  className="mb-6">Les derniers transactions</CardTitle>
                    <AdminMarks/>
                    <CardDescription >
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
</div>    </>
}
