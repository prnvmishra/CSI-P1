'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 398.5 0 256S111.3 0 244 0c69.9 0 129.4 28.3 173.4 74.5l-64.8 64.8C314.5 102.3 282.7 80 244 80 163.6 80 96 148.1 96 232s67.6 152 152 152c88.5 0 133.2-61.2 137.2-93.5h-137.2v-80h242.4c1.3 12.8 2.2 26.2 2.2 40.8z"/>
    </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setLoading(true);
    try {
      if (action === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast({ title: `Successfully ${action === 'login' ? 'logged in' : 'signed up'}!` });
      router.push('/profile');
    } catch (error: any) {
      toast({ title: 'Authentication Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: 'Successfully signed in with Google!' });
      router.push('/profile');
    } catch (error: any) {
      toast({ title: 'Google Sign-In Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
         <Image
            src="https://picsum.photos/seed/loginpage/1200/1800"
            alt="Abstract art"
            data-ai-hint="abstract art"
            fill
            className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-background/10" />
        <div className="absolute top-8 left-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-headline">Promptalizer</span>
            </Link>
        </div>
        <div className="absolute bottom-8 left-8 text-foreground">
            <blockquote className="space-y-2 bg-background/50 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-lg">
                “This tool is a game-changer for web design. The ability to transform a site with simple text prompts is pure magic.”
                </p>
                <footer className="text-sm text-muted-foreground">Sofia, Web Developer</footer>
            </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Access your account to continue your creative journey.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                    <Button onClick={() => handleAuthAction('login')} className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                        <GoogleIcon/>
                        Sign in with Google
                    </Button>
                    </CardFooter>
                </Card>
                </TabsContent>
                <TabsContent value="signup">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create an account to save your creations and earn badges.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                    <Button onClick={() => handleAuthAction('signup')} className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                        <GoogleIcon/>
                        Sign up with Google
                    </Button>
                    </CardFooter>
                </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
