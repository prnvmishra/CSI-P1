'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp,
  addDoc,
  setDoc,
  orderBy,
  onSnapshot,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  Loader2, 
  Share2, 
  MessageSquare, 
  ThumbsUp, 
  MoreHorizontal, 
  UserPlus, 
  Bookmark, 
  Settings, 
  LogOut, 
  Sparkles,
  BarChart2,
  Activity,
  Palette,
  Trophy,
  Award,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';

import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { ActivityFeed } from '@/components/activity-feed';
import { ProgressSystem } from '@/components/progress-system';
import { AchievementSystem } from '@/components/achievements/achievement-system';
import { ProfileTabs } from './tabs-fix';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Types
interface Post {
  id: string;
  content: string;
  likes: string[];
  comments: { userId: string; content: string; createdAt: any }[];
  createdAt: any;
  userId: string;
  userName: string;
  userAvatar?: string;
}

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  followers: string[];
  following: string[];
  posts: string[];
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      loadUserProfile();
      setupRealtimeUpdates();
    }
    
    return () => {
      // Cleanup function if needed
    };
  }, [user, loading, router]);
  
  const setupRealtimeUpdates = () => {
    if (!user) return;
    
    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setIsLoading(false);
    });
    
    return unsubscribe;
  };
  
  // handleCreatePost function is defined below
  
  const logActivity = async (type: string, content: string) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'activities'), {
        type,
        content,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || '',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setUserProfile(userData);
        setFollowersCount(userData.followers?.length || 0);
        setFollowingCount(userData.following?.length || 0);
        
        // Check if current user is following this profile
        if (auth.currentUser?.uid !== user.uid) {
          setIsFollowing(userData.followers?.includes(auth.currentUser?.uid || '') || false);
        }

        // Load user's posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Post));
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user || !auth.currentUser || !userProfile) return;

    try {
      const currentUserId = auth.currentUser.uid;
      const userRef = doc(db, 'users', user.uid);
      const currentUserRef = doc(db, 'users', currentUserId);

      if (isFollowing) {
        // Unfollow
        await updateDoc(userRef, {
          followers: arrayRemove(currentUserId)
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(user.uid)
        });
        setFollowersCount(prev => prev - 1);
      } else {
        // Follow
        await updateDoc(userRef, {
          followers: arrayUnion(currentUserId)
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(user.uid)
        });
        setFollowersCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update follow status',
        variant: 'destructive'
      });
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user || !userProfile) return;
    
    try {
      const postRef = collection(db, 'posts');
      const newPostData = {
        content: newPost,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || '',
        likes: [],
        comments: [],
        createdAt: serverTimestamp()
      };
      
      const postDoc = await addDoc(postRef, newPostData);
      
      // Update user's posts
      await updateDoc(doc(db, 'users', user.uid), {
        posts: arrayUnion(postDoc.id)
      });
      
      // Refresh posts
      setNewPost('');
      loadUserProfile();
      
      toast({
        title: 'Success',
        description: 'Your post has been published!'
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied to clipboard!',
        description: 'Share your profile with others.'
      });
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-heading">Promptalizer</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShareProfile} 
              title="Share profile"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />
            <div className="px-6 pb-6 -mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName} />
                    <AvatarFallback>
                      {userProfile.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{userProfile.displayName}</h1>
                    <p className="text-muted-foreground">@{userProfile.email?.split('@')[0]}</p>
                    {userProfile.bio && (
                      <p className="mt-2 text-sm text-muted-foreground">{userProfile.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-center sm:justify-end">
                  {auth.currentUser?.uid !== user.uid ? (
                    <Button 
                      variant={isFollowing ? 'outline' : 'default'}
                      onClick={handleFollow}
                      className="gap-2"
                    >
                      {isFollowing ? (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-center sm:justify-start gap-8 mt-6">
                <div className="text-center">
                  <p className="text-xl font-bold">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <Link href={`/profile/${user.uid}/followers`} className="text-center hover:underline">
                  <p className="text-xl font-bold">{followersCount}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </Link>
                <Link href={`/profile/${user.uid}/following`} className="text-center hover:underline">
                  <p className="text-xl font-bold">{followingCount}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </Link>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Posts Content */}
            {auth.currentUser?.uid === user.uid && (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleCreatePost}>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={user?.photoURL || ''} />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="What's on your mind?"
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[100px] resize-none border-0 shadow-none focus-visible:ring-0 text-base"
                          disabled={isPosting}
                        />
                        <div className="flex justify-end">
                          <Button type="submit" disabled={!newPost.trim() || isPosting}>
                            {isPosting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Posting...
                              </>
                            ) : 'Post'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center p-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-muted-foreground">
                  {auth.currentUser?.uid === user.uid 
                    ? 'Create your first post to get started!'
                    : 'This user has not posted anything yet.'}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={post.userAvatar} alt={post.userName} />
                            <AvatarFallback>{post.userName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {post.userId === user?.uid && (
                              <DropdownMenuItem className="text-red-500">
                                Delete Post
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex items-center gap-4 pt-2 border-t">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes?.length || 0}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Comment</span>
                        {post.comments?.length > 0 && (
                          <span className="ml-1 text-muted-foreground">
                            ({post.comments.length})
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </ProfileTabs>
        </div>
      </main>
    </div>
  );
}
