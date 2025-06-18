import { Outlet } from 'react-router-dom'
import '../index.css'

export default function Layout(){
    return (
        <main className="pt-0 mt-0">
            <Outlet/>
        </main>
    )
}