import { useState } from 'react'
import './App.css'
import {RouterProvider} from 'react-router-dom'
import { router } from './router/index.jsx'
import UserContext from './context/UserContext.jsx'
import {ThemeProvider} from './components/dark-mode/theme-provider.jsx'
import { Toaster } from "./components/ui/sonner"
import PropertyDetails from "./layouts/Client/PropertyDetails";
import OwnerContracts from './pages/owner/OwnerContracts';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserContext>
        <ThemeProvider defaultTheme="system" storageKey="my-theme">
              <RouterProvider router={router}/>
        </ThemeProvider>
    </UserContext>
    <Toaster />
      </>
  )
}

export default App
