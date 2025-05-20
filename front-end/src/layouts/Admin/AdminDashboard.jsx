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
import { User2, UserCheck2Icon } from "lucide-react"

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
            <div className="flex items-center space-x-2">
              <Button>More Info</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                   <User2 />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32456</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Owners
                    </CardTitle>
                   <UserCheck2Icon/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9426</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12344</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Staff
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">22</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
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
