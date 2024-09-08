import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from "@/lib/api/api.ts";
import { Profile } from '@/types/profile';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleUserRound } from 'lucide-react';
import { Input } from "@/components/ui/input.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const userID = authUser?.userId;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/${userID}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [userID]);

  const { toast } = useToast();

  const validateProfile = (profile: Profile) => {
    if (!profile.first_name || !profile.last_name || !profile.role) {
      toast({
        title: "Invalid Profile",
        description: "Please fill in all required fields."
      });
      return false;
    }
    return true;
  }

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile || !validateProfile(profile)) return;
    
    try {
      await api.post('/profiles/create', profile);
      toast({
        title: "Profile created successfully",
      });
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile || !validateProfile(profile)) return;
    
    try {
      await api.put(`/profiles/${profile._id}`, profile);
      toast({
        title: "Profile Updated",
      });
    } catch (error) {
      console.error('Error editing profile:', error);
    }
  }

  const handleDeleteProfile = async () => {
    if (!profile) {
      toast({
        title: "Invalid Profile",
        description: "Please select a valid profile to delete."
      });
      return;
    }

    try {
      await api.delete(`/profiles/${profile.userId}`);
      toast({
        title: "Profile Deleted",
      });
      setProfile(null);
    } catch (error) {
      console.error('Error deleting Profile:', error);
    }
  }

  let createProfileContent = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>
            Create Profile
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateProfile}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input id="first_name"
                   value={profile?.first_name || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, first_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input id="last_name"
                   value={profile?.last_name || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, last_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input id="Role"
                   value={profile?.role || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, role: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email"
                   value={profile?.email || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, email: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  let updateProfileContent = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update</DialogTitle>
          <DialogDescription>
            Update Profile
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input id="first_name"
                   value={profile?.first_name || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, first_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input id="last_name"
                   value={profile?.last_name || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, last_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input id="Role"
                   value={profile?.role || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, role: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email"
                   value={profile?.email || ''}
                   className="col-span-3"
                   onChange={(e) => setProfile({...profile!, email: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  let deleteProfileContent = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            All of your profile data will be permanently deleted.
            Do you wish to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDeleteProfile}><span className='red'>Delete</span></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <div>
            <CircleUserRound className={"w-10 p-0 m-0"}/>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{profile.first_name} {profile.last_name}</CardTitle>
            <Badge variant="secondary" className="mt-1">{profile.role}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-sm">{profile.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p className="text-sm capitalize">{profile.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <center>{createProfileContent} {updateProfileContent}</center>
      <center>{deleteProfileContent}</center>
    </div>
  );
};

export default ProfilePage;