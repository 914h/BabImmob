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
  const { login } = useUserContext()

  const onSubmit = async (values) => {
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <img src={logo} alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-gray-500">Enter your credentials to sign in to your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">
                {form.formState.errors.root.message}
            </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
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
      </div>
    </div>
  );
}