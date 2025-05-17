import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Layout from "../layouts/Layout.jsx";
import NotFound from "../pages/NotFound.jsx";
import GuestLayout from "../layouts/GuestLayout.jsx";
import StudentLayout from "../layouts/Student/StudentLayout.jsx";
import StudentDashboard from "../layouts/Student/StudentDashboard.jsx";
import AdminLayout from "../layouts/Admin/AdminLayout.jsx";
import AdminDashboard from "../layouts/Admin/AdminDashboard.jsx";
import TeacherLayout from "../layouts/Teacher/TeacherLayout.jsx";
import TeacherDashboard from "../layouts/Teacher/TeacherDashboard.jsx";
import ParentsManagement from "../components/Manage Tables/Manage Parents/ParentsManagement.jsx";
import ParentLayout from "../layouts/ParentLayout.jsx";
import StudentsManagement from "../components/Manage Tables/Manage Students/StudentsManagement.jsx";
import DevoirManagement from "../components/Manage Tables/Manage Devoirs/DevoirManagement.jsx";
import ClientsManagement from "../components/Manage Tables/Manage Clients/ClientManagement.jsx";
import OwnersManagement from "../components/Manage Tables/Manage Owners/OwnerManagement.jsx";
import AgentsManagement from "../components/Manage Tables/Manage Agents/AgentManagement.jsx";
import OwnerLayout from "../layouts/Owner/OwnerLayout.jsx";
import OwnerDashboard from "../layouts/Owner/OwnerDashboard.jsx";
import PropertiesList from "../components/Manage Tables/Manage Properties/PropertiesList.jsx";
import PropertyForm from "../components/Manage Tables/Manage Properties/PropertiesForm.jsx";
import PropertyDetails from "../components/Manage Tables/Manage Properties/PropertyDetails";

export const LOGIN_ROUTE = '/login';
const ADMIN_BASE_ROUTE = '/admin'
const OWNER_BASE_ROUTE = '/owner'

export const ADMIN_DASHBOARD_ROUTE = ADMIN_BASE_ROUTE + '/AdminDashboard';
export const ADMIN_MANAGE_PARENTS_ROUTE = ADMIN_BASE_ROUTE + '/manage-parents'
export const ADMIN_MANAGE_STUDENTS_ROUTE = ADMIN_BASE_ROUTE + '/manage-students'
export const ADMIN_MANAGE_CLIENTS_ROUTE = ADMIN_BASE_ROUTE + '/manage-clients'
export const ADMIN_MANAGE_OWNERS_ROUTE = ADMIN_BASE_ROUTE + '/manage-owners'
export const ADMIN_MANAGE_AGENTS_ROUTE = ADMIN_BASE_ROUTE + '/manage-agents'

export const OWNER_DASHBOARD_ROUTE = OWNER_BASE_ROUTE + '/dashboard';
export const OWNER_PROPERTIES_ROUTE = OWNER_BASE_ROUTE + '/properties';
export const OWNER_TENANTS_ROUTE = OWNER_BASE_ROUTE + '/tenants';
export const OWNER_FINANCES_ROUTE = OWNER_BASE_ROUTE + '/finances';
export const OWNER_SETTINGS_ROUTE = OWNER_BASE_ROUTE + '/settings';
export const OWNER_PROPERTY_CREATE_ROUTE = "/owner/properties/create";
export const OWNER_PROPERTY_EDIT_ROUTE = "/owner/properties/:id/edit";
export const OWNER_PROPERTY_DETAILS_ROUTE = "/owner/properties/:id";

export const TEACHER_DASHBOARD_ROUTE = '/Teacher/TeacherDashboard';
export const TEACHER_MANAGE_DEVOIRS_ROUTE = 'Teacher/manage-devoirs'

export const STUDENT_DASHBOARD_ROUTE = '/Student/StudentDashboard';
export const PARENT_DASHBOARD_ROUTE = '/Parent/ParentDashboard';

export const redirectToDashboard = (role) => {
  switch (role) {
    case 'student':
      return (STUDENT_DASHBOARD_ROUTE);
    case 'admin':
      return (ADMIN_DASHBOARD_ROUTE);
    case 'teacher':
      return (TEACHER_DASHBOARD_ROUTE);
    case 'parent':
      return (PARENT_DASHBOARD_ROUTE);
    case 'owner':
      return (OWNER_DASHBOARD_ROUTE);
    case '':
      return (LOGIN_ROUTE);
    default:
      return (LOGIN_ROUTE);
  }
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '*',
        element: <NotFound />
      },
    ],
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: LOGIN_ROUTE,
        element: <Login />
      }
    ]
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: ADMIN_DASHBOARD_ROUTE,
        element: <AdminDashboard />
      },
      {
        path: ADMIN_MANAGE_PARENTS_ROUTE,
        element: <ParentsManagement />
      },
      {
        path: ADMIN_MANAGE_STUDENTS_ROUTE,
        element: <StudentsManagement />
      },
      {
        path: ADMIN_MANAGE_CLIENTS_ROUTE,
        element: <ClientsManagement />
      },
      {
        path: ADMIN_MANAGE_OWNERS_ROUTE,
        element: <OwnersManagement />
      },
      {
        path: ADMIN_MANAGE_AGENTS_ROUTE,
        element: <AgentsManagement />
      }
    ]
  },
  {
    element: <OwnerLayout />,
    children: [
      {
        path: OWNER_DASHBOARD_ROUTE,
        element: <OwnerDashboard />
      },
      {
        path: OWNER_PROPERTIES_ROUTE,
        element: <PropertiesList />
      },
      {
        path: OWNER_PROPERTY_CREATE_ROUTE,
        element: <PropertyForm />
      },
      {
        path: OWNER_PROPERTY_EDIT_ROUTE,
        element: <PropertyForm />
      },
      {
        path: OWNER_PROPERTY_DETAILS_ROUTE,
        element: <PropertyDetails />
      }
    ]
  },
  {
    element: <StudentLayout />,
    children: [
      {
        path: STUDENT_DASHBOARD_ROUTE,
        element: <StudentDashboard />
      }
    ]
  },
  {
    element: <TeacherLayout />,
    children: [
      {
        path: TEACHER_DASHBOARD_ROUTE,
        element: <TeacherDashboard />
      }, {
        path: TEACHER_MANAGE_DEVOIRS_ROUTE,
        element: <DevoirManagement />
      },
    ]
  },
  {
    element: <ParentLayout />,
    children: [
      {
        path: PARENT_DASHBOARD_ROUTE,
        element: <TeacherDashboard />
      }
    ]
  }
]);
