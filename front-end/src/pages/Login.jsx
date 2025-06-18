import LoginInterface from '../login/LoginInterface.jsx';
import Logo from '../assets/logo/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { ModeToggle } from '../components/dark-mode/mode-toggle';
import { Button } from '../components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Modern Client-Style Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="Logo" className="w-10 h-10 object-contain dark:invert" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-modern">Bab-Immobilier</h1>
                <p className="text-xs text-muted-foreground">Your Dream Home Awaits</p>
              </div>
            </div>
            {/* Navigation Actions */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-primary-modern hover:underline font-semibold px-3 py-2 rounded transition-colors">Home</Link>
              <Link to="/public-properties" className="text-primary-modern hover:underline font-semibold px-3 py-2 rounded transition-colors">Properties</Link>
              <Button
                onClick={() => navigate('/login')}
                className="bg-primary-modern text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow"
              >
                Login
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Column - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-background text-foreground">
          <LoginInterface/>
        </div>
        {/* Right Column - Background Image and Text */}
        <div 
          className="w-1/2 relative bg-cover bg-center hidden md:flex items-center justify-center text-center text-white p-6"
          style={{ backgroundImage: `url('/images/backimg.jpg')` }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div> {/* Darker overlay */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Welcome to Our Real Estate Platform</h2>
            <p className="text-lg drop-shadow-lg">Find your perfect property with ease. Join us to explore a wide range of listings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}