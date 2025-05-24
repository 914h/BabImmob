import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../../index.css'
import Logo from '../../assets/logo/logo.png'
import { LOGIN_ROUTE, OWNER_DASHBOARD_ROUTE } from '../../router'
import { useUserContext } from '../../context/UserContext'
import { StudentDropdownmenu } from '../ui/StudentUI/StudentDropdownmenu'
import UserApi from '../../services/api/UserApi'
import { useEffect, useState } from 'react'
import { GaugeIcon, LayoutPanelLeft, Bell, Settings } from 'lucide-react'
import { ModeToggle } from '../../components/dark-mode/mode-toggle'
import { Button } from '../../components/ui/button'
import { OwnerSidebar } from '../ui/OwnerUI/OwnerSidebar'
import { OwnerDropdownmenu } from '../ui/OwnerUI/OwnerDropdownmenu'
import { Badge } from '../../components/ui/badge'

export default function OwnerLayout(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const {setUser, setAuthenticated, Authenticated, user , logout} = useUserContext()

    useEffect(() => {
      if(Authenticated === true){
        setIsLoading(false)
        UserApi.getUser().then(({data}) =>{
            const { role } = data
            console.log(role)
            if(role !== 'owner') {
             navigate(redirectToDashboard(role));
           }
            setUser(data)
            setAuthenticated(true)
          }).catch((reason) => {
            logout()
          })
      }
      else{
        navigate(LOGIN_ROUTE)
      }
    }, [Authenticated])

    return <>
    <header className="sticky top-0 z-50">
        <div className="bg-gray-800 bg-opacity-90 px-12 py-4 mb-4 mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
                    <div className="text-2xl text-white font-semibold">
                        Property Management Bab-Immobilier
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to={OWNER_DASHBOARD_ROUTE}>
                        <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 text-lg px-6 py-2 rounded-xl">
                            <LayoutPanelLeft className="mr-2 h-6 w-6" />
                            Dashboard
                        </Button>
                    </Link>
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 relative text-lg px-6 py-2 rounded-xl">
                        <Bell className="mr-2 h-6 w-6" />
                        <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-sm">
                            3
                        </Badge>
                    </Button>
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 text-lg px-6 py-2 rounded-xl">
                        <Settings className="mr-2 h-6 w-6" />
                    </Button>
                    <OwnerDropdownmenu/>
                    <ModeToggle/>
                </div>
            </div>
        </div>
    </header>
    <main className={'mx-auto px-10 space-y-4 py-4'}>
        <div className="flex">
            <div className={'w-100 md:w-1/6'}>
                <OwnerSidebar/>
            </div>
            <div className={'w-100 md:w-5/6'}>
                <Outlet/>
            </div>
        </div>
    </main>
</>
}