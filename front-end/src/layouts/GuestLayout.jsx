import {Outlet, useNavigate} from 'react-router-dom'
import '../index.css'
import { useEffect } from 'react'
import { useUserContext } from '../context/UserContext.jsx'
import {LOGIN_ROUTE, redirectToDashboard} from '../router/index.jsx'
import GeneralNav from './ui/GeneralNav.jsx'

export default function GuestLayout(){
    const navigate = useNavigate();
    const context = useUserContext()

    useEffect(() => {
        if(context.Authenticated){
            navigate(redirectToDashboard(context.user.role))
        }
    }, [])
    const handleLogout = () => {
        context.logout()
        navigate(LOGIN_ROUTE)
    }
    return<>
    <header>
        <GeneralNav/>
    </header>
        <main className={'container'}>
            <Outlet/>
        </main>
    </>
}