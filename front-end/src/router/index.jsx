import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Layout from "../layouts/Layout.jsx";
import NotFound from "../pages/NotFound.jsx";
import GuestLayout from "../layouts/GuestLayout.jsx";
import AdminLayout from "../layouts/Admin/AdminLayout.jsx";
import AdminDashboard from "../layouts/Admin/AdminDashboard.jsx";
import ClientsManagement from "../components/Manage Tables/Manage Clients/ClientManagement.jsx";
import OwnersManagement from "../components/Manage Tables/Manage Owners/OwnerManagement.jsx";
import AgentsManagement from "../components/Manage Tables/Manage Agents/AgentManagement.jsx";
import OwnerLayout from "../layouts/Owner/OwnerLayout.jsx";
import OwnerDashboard from "../layouts/Owner/OwnerDashboard.jsx";
import PropertiesList from "../components/Manage Tables/Manage Properties/PropertiesList.jsx";
import PropertyForm from "../components/Manage Tables/Manage Properties/PropertiesForm.jsx";
import OwnerPropertyDetails from "../components/Manage Tables/Manage Properties/PropertyDetails";
import OwnerVisitsList from "../components/Manage Tables/Manage Visits/OwnerVisitsList.jsx";
import ClientLayout from "../layouts/Client/ClientLayout.jsx";
import ClientHomePage from "../layouts/Client/ClientHomePage.jsx";
import ClientPropertyDetails from "../layouts/Client/PropertyDetails.jsx";
import Contracts from '@/pages/ClientDashboard/Contracts';
import NewContract from '@/pages/ClientDashboard/NewContract';
import ContractDetails from '@/pages/ClientDashboard/ContractDetails';
import OwnerContracts from '../pages/owner/OwnerContracts';
import OwnerProfile from '../pages/owner/OwnerProfile';
import ClientContracts from '../pages/ClientDashboard/ClientContracts';
import ClientVisits from '../pages/ClientDashboard/ClientVisits';
import ClientProfile from '../pages/ClientDashboard/ClientProfile';
import PublicProperties from '../pages/PublicProperties';

// Placeholder components for new admin pages
const AdminProperties = () => <div>Admin Properties Page</div>;
const AdminContracts = () => <div>Admin Contracts Page</div>;
const AdminTransactions = () => <div>Admin Transactions Page</div>;
const AdminVisitRequests = () => <div>Admin Visit Requests Page</div>;
const AdminEvents = () => <div>Admin Events Page</div>;

export const LOGIN_ROUTE = '/login';
export const HOME_ROUTE = '/home';
export const PUBLIC_PROPERTIES_ROUTE = '/properties';
const ADMIN_BASE_ROUTE = '/admin'
const OWNER_BASE_ROUTE = '/owner'
const CLIENT_BASE_ROUTE = '/client'

export const ADMIN_DASHBOARD_ROUTE = ADMIN_BASE_ROUTE + '/dashboard';
export const ADMIN_MANAGE_USERS_ROUTE = ADMIN_BASE_ROUTE + '/users';
export const ADMIN_MANAGE_CLIENTS_ROUTE = ADMIN_BASE_ROUTE + '/manage-clients'
export const ADMIN_MANAGE_OWNERS_ROUTE = ADMIN_BASE_ROUTE + '/manage-owners'
export const ADMIN_MANAGE_AGENTS_ROUTE = ADMIN_BASE_ROUTE + '/manage-agents'
export const ADMIN_PROPERTIES_ROUTE = ADMIN_BASE_ROUTE + '/properties';
export const ADMIN_CONTRACTS_ROUTE = ADMIN_BASE_ROUTE + '/contracts';
export const ADMIN_TRANSACTIONS_ROUTE = ADMIN_BASE_ROUTE + '/transactions';
export const ADMIN_VISIT_REQUESTS_ROUTE = ADMIN_BASE_ROUTE + '/visit-requests';
export const ADMIN_EVENTS_ROUTE = ADMIN_BASE_ROUTE + '/events';

export const OWNER_DASHBOARD_ROUTE = OWNER_BASE_ROUTE + '/dashboard';
export const OWNER_PROPERTIES_ROUTE = OWNER_BASE_ROUTE + '/properties';
export const OWNER_TENANTS_ROUTE = OWNER_BASE_ROUTE + '/tenants';
export const OWNER_FINANCES_ROUTE = OWNER_BASE_ROUTE + '/finances';
export const OWNER_SETTINGS_ROUTE = OWNER_BASE_ROUTE + '/settings';
export const OWNER_PROPERTY_CREATE_ROUTE = "/owner/properties/create";
export const OWNER_PROPERTY_EDIT_ROUTE = "/owner/properties/:id/edit";
export const OWNER_PROPERTY_DETAILS_ROUTE = "/owner/properties/:id";
export const OWNER_VISITS_ROUTE = OWNER_BASE_ROUTE + '/visits';

export const CLIENT_DASHBOARD_ROUTE = CLIENT_BASE_ROUTE + '/dashboard';
export const CLIENT_PROPERTIES_ROUTE = CLIENT_BASE_ROUTE + '/properties';
export const CLIENT_PROFILE_ROUTE = CLIENT_BASE_ROUTE + '/profile';
export const CLIENT_PROPERTY_DETAILS_ROUTE = CLIENT_BASE_ROUTE + '/properties/:id';

export const redirectToDashboard = (role) => {
  switch (role) {
    case 'admin':
      return (ADMIN_DASHBOARD_ROUTE);
    case 'owner':
      return (OWNER_DASHBOARD_ROUTE);
    case 'client':
      return (CLIENT_PROPERTIES_ROUTE);
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
        element: <Home />
      },
      {
        path: PUBLIC_PROPERTIES_ROUTE,
        element: <PublicProperties />
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
      },
      {
        path: ADMIN_PROPERTIES_ROUTE,
        element: <AdminProperties />
      },
      {
        path: ADMIN_CONTRACTS_ROUTE,
        element: <AdminContracts />
      },
      {
        path: ADMIN_TRANSACTIONS_ROUTE,
        element: <AdminTransactions />
      },
      {
        path: ADMIN_VISIT_REQUESTS_ROUTE,
        element: <AdminVisitRequests />
      },
      {
        path: ADMIN_EVENTS_ROUTE,
        element: <AdminEvents />
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
        element: <OwnerPropertyDetails />
      },
      {
        path: OWNER_VISITS_ROUTE,
        element: <OwnerVisitsList />
      },
      {
        path: '/owner/contracts',
        element: <OwnerContracts />
      },
      {
        path: '/owner/profile',
        element: <OwnerProfile />
      }
    ]
  },
  {
    element: <ClientLayout />,
    children: [
      {
        path: CLIENT_DASHBOARD_ROUTE,
        element: <ClientHomePage />
      },
      {
        path: CLIENT_PROPERTIES_ROUTE,
        element: <ClientHomePage />
      },
      {
        path: CLIENT_PROFILE_ROUTE,
        element: <ClientProfile />
      },
      {
        path: CLIENT_PROPERTY_DETAILS_ROUTE,
        element: <ClientPropertyDetails />
      },
      {
        path: '/client/contracts',
        element: <ClientContracts />
      },
      {
        path: '/client/visits',
        element: <ClientVisits />
      },
      {
        path: 'contracts',
        element: <Contracts />
      },
      {
        path: 'contracts/new',
        element: <NewContract />
      },
      {
        path: 'contracts/:id',
        element: <ContractDetails />
      }
    ]
  }
]);
