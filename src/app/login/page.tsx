'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const signupSchema = loginSchema.extend({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 398.5 0 256S111.3 0 244 0c69.9 0 129.4 28.3 173.4 74.5l-64.8 64.8C314.5 102.3 282.7 80 244 80 163.6 80 96 148.1 96 232s67.6 152 152 152c88.5 0 133.2-61.2 137.2-93.5h-137.2v-80h242.4c1.3 12.8 2.2 26.2 2.2 40.8z"/>
  </svg>
);

const FormError = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-sm text-destructive">
    <AlertCircle className="h-4 w-4" />
    <span>{message}</span>
  </div>
);

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize auth on client-side only
  const [auth, setAuth] = useState(() => {
    if (typeof window !== 'undefined') {
      return getAuth(app);
    }
    return null;
  });

  useEffect(() => {
    setAuthInitialized(true);
  }, []);

  if (loading || !authInitialized) {
    return <div>Loading...</div>;
  }

  const [activeTab, setActiveTab] = useState('login');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const onLogin = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
    }
  };

  const onSignup = async (data: SignupFormValues) => {
    try {
      await signUp(data.email, data.password, data.displayName);
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created.',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
    }
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Success!',
        description: 'You have been successfully signed in with Google.',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message || 'An error occurred during Google sign in',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden h-full bg-gradient-to-br from-primary/10 to-muted/50 lg:flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
        <div className="relative z-20 text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md">
            Sign in to access your personalized dashboard and start your creative journey with our powerful tools.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-background/10" />
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-headline">Promptalizer</span>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 text-foreground">
        <blockquote className="space-y-2 bg-background/50 backdrop-blur-sm p-4 rounded-lg">
          <p className="text-lg">
            "This tool is a game-changer for web design. The ability to transform a site with simple text prompts is pure magic."
          </p>
        </blockquote>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Our Platform</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account or create a new one</p>
          </div>
          
          <Tabs 
            defaultValue="login" 
            className="space-y-6"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          {...loginForm.register('email')}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <FormError message={loginForm.formState.errors.email.message || ''} />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link 
                          href="/forgot-password" 
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          className="pl-10"
                          {...loginForm.register('password')}
                        />
                      </div>
                      {loginForm.formState.errors.password && (
                        <FormError message={loginForm.formState.errors.password.message || ''} />
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={authLoading}>
                      {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={signInWithGoogle} 
                    disabled={authLoading}
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create an account</CardTitle>
                  <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          className="pl-10"
                          {...signupForm.register('displayName')}
                        />
                      </div>
                      {signupForm.formState.errors.displayName && (
                        <FormError message={signupForm.formState.errors.displayName.message || ''} />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          {...signupForm.register('email')}
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <FormError message={signupForm.formState.errors.email.message || ''} />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          className="pl-10"
                          {...signupForm.register('password')}
                        />
                      </div>
                      {signupForm.formState.errors.password && (
                        <FormError message={signupForm.formState.errors.password.message || ''} />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          className="pl-10"
                          {...signupForm.register('confirmPassword')}
                        />
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <FormError message={signupForm.formState.errors.confirmPassword.message || ''} />
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full mt-2" disabled={authLoading}>
                      {authLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={signInWithGoogle} 
                    disabled={authLoading}
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                </CardContent>
                
                <CardFooter className="text-center text-sm text-muted-foreground">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setActiveTab('signup')}
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setActiveTab('login')}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
