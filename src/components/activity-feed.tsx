'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ThumbsUp, MessageSquare, UserPlus } from 'lucide-react';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'post';
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Timestamp;
}

export function ActivityFeed({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const activitiesQuery = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      setActivities(activitiesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4 text-primary" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No activities yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback>{activity.userName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span> {activity.content}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.createdAt?.toDate?.() || activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
