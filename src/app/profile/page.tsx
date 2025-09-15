'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ThemeDashboard } from '@/components/theme-dashboard';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
         <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/">
                    <h1 className="text-xl font-bold font-headline">Promptalizer</h1>
                </Link>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>
        </header>
        <main className="container mx-auto py-12 px-4 md:px-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl font-headline">{user.displayName || 'Welcome!'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <ThemeDashboard />
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
