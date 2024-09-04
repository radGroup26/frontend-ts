import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
}

const ProfileCard: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        {/* <Avatar className="w-16 h-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback><User className="w-8 h-8" /></AvatarFallback>
        </Avatar> */}
        <div>
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          <Badge variant="secondary" className="mt-1">{user.role}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
            <p className="text-sm capitalize">{user.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;