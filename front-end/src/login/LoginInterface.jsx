import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form.tsx";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { redirectToDashboard } from '../router/index.jsx'
import { Loader } from "lucide-react";
import { useUserContext } from "../context/UserContext.jsx"
import logo from "../assets/logo/logoo.png"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { useState } from 'react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const formSchema = z.object({
    email: z.string().email().min(5).max(30),
    password: z.string().min(8).max(150),
});

// Define separate schemas for Owner and Client registration
const ownerRegistrationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(8, "Password confirmation is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  img: z.instanceof(File).optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const clientRegistrationSchema = z.object({
  nom: z.string().min(2, "Last name is required"),
  prenom: z.string().min(2, "First name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(8, "Password confirmation is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  image: z.instanceof(File).optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export default function LoginInterface() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [accountType, setAccountType] = useState(null); // 'owner' or 'client'
  
  const loginForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const ownerRegisterForm = useForm({
    resolver: zodResolver(ownerRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      address: '',
      img: null,
    }
  });

  const clientRegisterForm = useForm({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      address: '',
      image: null,
    }
  });

  const { setError, formState: { isSubmitting: isLoggingIn } } = loginForm;
  const navigate = useNavigate();
  const { login } = useUserContext();

  const onLoginSubmit = async (values) => {
    try {
      console.log('Attempting login with:', values.email);
      const result = await login(values.email, values.password);
      console.log('Login response:', result);

      if (result.success) {
        const userData = result.data.user;
        console.log('User role from response:', userData.role);
        console.log('User data:', userData);
        
        const redirectPath = redirectToDashboard(userData.role);
        console.log('Calculated redirect path:', redirectPath);
          console.log('Navigating to:', redirectPath);
        navigate(redirectPath);
      } else {
        setError('root', { message: result.error || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { message: error.message || 'An error occurred during login' });
    }
  };

  const onRegisterSubmit = async (values) => {
    console.log('Registering as', accountType, values);
    const url = accountType === 'owner' ? `${BACKEND_URL}/api/register-owner` : `${BACKEND_URL}/api/register-client`;

    try {
      let response, data;
      if (accountType === 'owner' || accountType === 'client') {
        // Use FormData for both owner and client registration to support file upload
        const formData = new FormData();
        if (accountType === 'client') {
          formData.append('nom', values.nom);
          formData.append('prenom', values.prenom);
          formData.append('email', values.email);
          formData.append('phone', values.phone || '');
          formData.append('address', values.address || '');
          formData.append('password', values.password);
          formData.append('password_confirmation', values.password_confirmation);
          if (values.image) {
            formData.append('image', values.image);
          }
        } else {
          Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (key === 'img') {
                formData.append('img', value);
              } else {
                formData.append(key, value);
              }
            }
          });
        }
        response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
      } else {
        // fallback (should not happen)
        response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      }
      data = await response.json();

      if (!response.ok) {
        // Handle validation errors or other API errors
        if (data.errors) {
          // Set form errors using the appropriate form hook
          const formHook = accountType === 'owner' ? ownerRegisterForm : clientRegisterForm;
          Object.keys(data.errors).forEach(key => {
            formHook.setError(key, { message: data.errors[key][0] });
          });
        } else {
           const formHook = accountType === 'owner' ? ownerRegisterForm : clientRegisterForm;
           formHook.setError('root', { message: data.message || 'Registration failed' });
        }
        throw new Error(data.message || 'Registration failed');
      }

      toast.success(`${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created successfully! Redirecting...`);
      // Auto-login after registration
      const loginResponse = await login(values.email, values.password);
      if (loginResponse.success) {
        const userData = loginResponse.data.user;
        const redirectPath = redirectToDashboard(userData.role);
        navigate(redirectPath);
      } else {
      setShowRegisterForm(false);
      setAccountType(null);
      if(accountType === 'owner') ownerRegisterForm.reset();
      else clientRegisterForm.reset();
      }

    } catch (error) {
      console.error('Registration error:', error);
      // Error already set by the above logic
    }
  };

  const isRegistering = accountType === 'owner' ? ownerRegisterForm.formState.isSubmitting : clientRegisterForm.formState.isSubmitting;

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center py-12 w-full">
      <Card className="mx-auto max-w-sm w-full bg-background border border-border shadow-lg rounded-lg text-foreground">
        <CardHeader className="bg-background rounded-t-lg py-8 border-b border-border">
           <img src={logo} alt="Logo" className="mx-auto h-32 w-32 object-contain mb-4 rounded-full" />
          <CardTitle className="text-2xl text-center ">{showRegisterForm ? 'Create an Account' : 'Welcome back'}</CardTitle>
          <p className="text-gray-500 text-center">{showRegisterForm ? 'Choose account type or fill in details' : 'Enter your credentials to sign in to your account'}</p>
        </CardHeader>
        <CardContent className="py-6">

          {!showRegisterForm ? (
            // Login Form
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="grid gap-4">
              <FormField
                    control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input placeholder="m@example.com" {...field} className="border-primary-modern focus:ring-primary-modern" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                    control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                  <FormLabel>Password</FormLabel>
                    <FormControl>
                    <Input type="password" {...field} className="border-primary-modern focus:ring-primary-modern" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {loginForm.formState.errors.root && (
                  <div className="text-red-500 text-sm mt-2">
                    {loginForm.formState.errors.root.message}
            </div>
            )}
                <Button type="submit" className="w-full bg-primary-modern text-white hover:bg-blue-600 font-semibold" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Form>
          ) : accountType === null ? (
            // Account Type Selection
            <div className="grid gap-4">
              <Button variant="outline" className="border-primary-modern text-primary-modern hover:bg-primary-modern hover:text-white" onClick={() => setAccountType('owner')}>Register as Owner</Button>
              <Button variant="outline" className="border-primary-modern text-primary-modern hover:bg-primary-modern hover:text-white" onClick={() => setAccountType('client')}>Register as Client</Button>
              <Button variant="link" className="text-primary-modern underline" onClick={() => setShowRegisterForm(false)}>Back to Login</Button>
            </div>
          ) : accountType === 'owner' ? (
            // Owner Registration Form
            <Form {...ownerRegisterForm}>
              <form onSubmit={ownerRegisterForm.handleSubmit(onRegisterSubmit)} className="grid gap-4">
                 <FormField
                    control={ownerRegisterForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ownerRegisterForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={ownerRegisterForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Phone</FormLabel>
                        <FormControl>
                        <Input placeholder="06 00 00 00 00" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={ownerRegisterForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input placeholder="123 Main St" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ownerRegisterForm.control}
                    name="img"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image (optional)</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={e => field.onChange(e.target.files[0])} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ownerRegisterForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={ownerRegisterForm.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {ownerRegisterForm.formState.errors.root && (
                      <div className="text-red-500 text-sm mt-2">
                        {ownerRegisterForm.formState.errors.root.message}
                    </div>
                    )}
                <Button type="submit" className="w-full bg-primary-modern text-white hover:bg-blue-600 font-semibold" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                 <Button variant="link" className="text-primary-modern underline" onClick={() => setAccountType(null)}>Back</Button>
              </form>
            </Form>
          ) : (
            // Client Registration Form
             <Form {...clientRegisterForm}>
              <form onSubmit={clientRegisterForm.handleSubmit(onRegisterSubmit)} className="grid gap-4">
                 <FormField
                    control={clientRegisterForm.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Doe" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientRegisterForm.control}
                    name="prenom"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>First Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientRegisterForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={clientRegisterForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Phone</FormLabel>
                        <FormControl>
                        <Input placeholder="06 00 00 00 00" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientRegisterForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input placeholder="123 Main St" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientRegisterForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image (optional)</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={e => field.onChange(e.target.files[0])} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientRegisterForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={clientRegisterForm.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} className="border-primary-modern focus:ring-primary-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {clientRegisterForm.formState.errors.root && (
                      <div className="text-red-500 text-sm mt-2">
                        {clientRegisterForm.formState.errors.root.message}
                    </div>
                    )}
                <Button type="submit" className="w-full bg-primary-modern text-white hover:bg-blue-600 font-semibold" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                 <Button variant="link" className="text-primary-modern underline" onClick={() => setAccountType(null)}>Back</Button>
              </form>
            </Form>
          )}


          {!showRegisterForm && (
             <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Button variant="link" onClick={() => setShowRegisterForm(true)} className="p-0">
                Sign up
              </Button>
      </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}