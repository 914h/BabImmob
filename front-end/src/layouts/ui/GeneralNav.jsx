import { ModeToggle } from "../../components/dark-mode/mode-toggle";
import { LOGIN_ROUTE} from "../../router";
import Logo from '../../assets/logo/logo.png' // Keep Logo import
import {LogIn, Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { GeneralDropdownmenu } from "./GeneralDropdownmenu";
import { Button } from "../../components/ui/button"

export default function GeneralNav(){
    return (
        <div className="items-center bg-gray-800 justify-between flex bg-opacity-90 px-12 py-2 mb-4 mx-auto sticky top-0 z-50">
            <div className="flex items-center space-x-4">
                <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
                <div className="text-2xl text-white font-semibold">
                    Bab-Immobilier
                </div>
            </div>
            <div>
                <ul className="flex text-white place-items-center space-x-4">
                    <li>
                        <Link to="/">
                             <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 text-lg px-6 py-2 rounded-xl">
                                <HomeIcon className="mr-2 h-6 w-6" />
                                Home
                             </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={LOGIN_ROUTE}>
                             <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-700 text-lg px-6 py-2 rounded-xl">
                                <LogIn className="mr-2 h-6 w-6" />Login
                             </Button>
                        </Link>
                    </li>
                    <li>
                        <GeneralDropdownmenu/>
                    </li>
                    <li>
                        <ModeToggle/>
                    </li>
                </ul>
            </div>
        </div>

    );
}