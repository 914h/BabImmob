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
import logo from "../assets/logo/logo.png"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { useState } from 'react';

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
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const clientRegistrationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(8, "Password confirmation is required"),
  phone: z.string().optional(),
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
    }
  });

  const clientRegisterForm = useForm({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
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
    // Handle registration submission based on accountType
    console.log('Registering as', accountType, values);
    const url = accountType === 'owner' ? `${BACKEND_URL}/api/register-owner` : `${BACKEND_URL}/api/register-client`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

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

      toast.success(`${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created successfully! Please log in.`);
      setShowRegisterForm(false);
      setAccountType(null);
      // Optionally clear form
      if(accountType === 'owner') ownerRegisterForm.reset();
      else clientRegisterForm.reset();

    } catch (error) {
      console.error('Registration error:', error);
      // Error already set by the above logic
    }
  };

  const isRegistering = accountType === 'owner' ? ownerRegisterForm.formState.isSubmitting : clientRegisterForm.formState.isSubmitting;

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center py-12 w-full">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="bg-gray-800 bg-opacity-90 dark:bg-gray-800 rounded-t-lg py-8">
           <img src={logo} alt="Logo" className="mx-auto h-32 w-32 object-contain mb-4" />
          <CardTitle className="text-2xl text-center text-white">{showRegisterForm ? 'Create an Account' : 'Welcome back'}</CardTitle>
          <p className="text-gray-300 text-center">{showRegisterForm ? 'Choose account type or fill in details' : 'Enter your credentials to sign in to your account'}</p>
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
                        <Input placeholder="m@example.com" {...field} />
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
                        <Input type="password" {...field} />
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
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
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
              <Button variant="outline" onClick={() => setAccountType('owner')}>Register as Owner</Button>
              <Button variant="outline" onClick={() => setAccountType('client')}>Register as Client</Button>
              <Button variant="link" onClick={() => setShowRegisterForm(false)}>Back to Login</Button>
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
                        <Input placeholder="John Doe" {...field} />
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
                        <Input type="email" placeholder="m@example.com" {...field} />
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
                      <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                        <Input placeholder="+1234567890" {...field} />
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
                      <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                        <Input placeholder="123 Main St" {...field} />
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
                        <Input type="password" {...field} />
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
                        <Input type="password" {...field} />
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
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Owner Account'
                  )}
                </Button>
                 <Button variant="link" onClick={() => setAccountType(null)}>Back to Type Selection</Button>
              </form>
            </Form>
          ) : (
            // Client Registration Form
             <Form {...clientRegisterForm}>
              <form onSubmit={clientRegisterForm.handleSubmit(onRegisterSubmit)} className="grid gap-4">
                 <FormField
                    control={clientRegisterForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                      <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                        <Input type="email" placeholder="m@example.com" {...field} />
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
                      <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                        <Input placeholder="+1234567890" {...field} />
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
                        <Input type="password" {...field} />
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
                        <Input type="password" {...field} />
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
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Client Account'
                  )}
                </Button>
                 <Button variant="link" onClick={() => setAccountType(null)}>Back to Type Selection</Button>
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