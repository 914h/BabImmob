import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form.tsx";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { redirectToDashboard } from '../router/index.jsx'
import { Loader } from "lucide-react";
import { useUserContext } from "../context/StudentContext.jsx"
import logo from "../assets/logo/logo.png"

const formSchema = z.object({
    email: z.string().email().min(5).max(30),
    password: z.string().min(8).max(150),
});

export default function LoginInterface() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { setError, formState: { isSubmitting } } = form
  const navigate = useNavigate();
  const { login, setAuthenticated, setToken, setUser } = useUserContext()

  const onSubmit = async values => {
    try {
      console.log('Attempting login with:', values.email);
      const { status, data } = await login(values.email, values.password);
      console.log('Login response:', { status, data });
      console.log('Full response data:', JSON.stringify(data, null, 2));

      if (status === 200) {
        console.log('Login successful, setting up user session');
        setToken(data.token);
        setAuthenticated(true);
        setUser(data.user);
        
        const { role } = data.user;
        console.log('User role from response:', role);
        console.log('User data:', JSON.stringify(data.user, null, 2));
        
        const redirectPath = redirectToDashboard(role);
        console.log('Calculated redirect path:', redirectPath);
        
        // Force navigation after a short delay to ensure state is updated
        setTimeout(() => {
          console.log('Navigating to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.errors?.email?.[0] || 
                          error.response?.data?.message || 
                          'An error occurred during login';
      setError('email', {
        message: errorMessage
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg">
              <img
                className="h-40 w-auto object-contain filter drop-shadow-lg"
                src={logo}
                alt="BABIMMOB Logo"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            BABIMMOB
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Please sign in to your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {form.formState.errors.root && (
              <div className="p-4 text-sm text-red-800 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/50">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              disabled={isSubmitting} 
              type="submit"
            >
              {isSubmitting ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}