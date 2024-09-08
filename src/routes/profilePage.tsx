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
  const [profile, setProfile] = useState<Profile>({ _id: '', first_name: '', last_name: '', role: '', email: '', userId: userID });
  const [isLoading, setIsLoading] = useState(true);
  const [newProfile, setNewProfile] = useState<Profile>({
    _id: '',
    first_name: '',
    last_name: '',
    role: '',
    email: '',
    userId: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  
    return () => clearTimeout(timer);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profiles/${userID}`);
      if (response.status === 200 && (response.data)) {
        setProfile(response.data);
        setNewProfile({
          _id: response.data._id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          role: response.data.role,
          email: response.data.email,
          userId: userID
        });
        toast({
          title: "Profile Fetched",
          description: "Your profile has been successfully fetched.",
        });
      } else {
        throw new Error("Failed to fetch profile");
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      toast({
        title: "Error Fetching Profile",
        description: "An error occurred while fetching your profile.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateProfile = (profile: Profile) => {
    if (!profile.first_name || !profile.last_name || !profile.role) {
      toast({
        title: "Invalid Profile",
        description: "Please fill in all required fields."
      });
      return false;
    }
    return true;
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateProfile(newProfile)) return;

    try {
      const updatedProfile = { ...newProfile, userId: userID };
      const response = await api.post('/profiles/create', updatedProfile);
      setProfile(newProfile);
      setNewProfile({
        _id: response.data._id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        role: response.data.role,
        email: response.data.email,
        userId: userID
      });
      
      toast({
        title: "Profile created successfully",
        description: "Your profile has been created.",
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error Creating Profile",
        description: "An error occurred while creating your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile || !validateProfile(profile)) return;
    
    try {
      const updatedProfile = { ...profile, userId: userID };
      const response = await api.put(`/profiles/update/${userID}`, updatedProfile);
      
      setProfile(newProfile);
      setNewProfile({
        _id: response.data._id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        role: response.data.role,
        email: response.data.email,
        userId: userID
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error editing profile:', error);
      toast({
        title: "Error Updating Profile",
        description: "An error occurred while updating your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile) {
      toast({
        title: "Invalid Profile",
        description: "Please select a valid profile to delete."
      });
      return;
    }

    try {
      await api.delete(`/profiles/delete/${userID}`);
      
      setNewProfile({
        _id: '',
        first_name: '',
        last_name: '',
        role: '',
        email: '',
        userId: ''
      });
      setProfile(newProfile);

      toast({
        title: "Profile Deleted",
        description: "Your profile has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting Profile:', error);
      toast({
        title: "Error Deleting Profile",
        description: "An error occurred while deleting your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createProfileContent = (
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
              value={newProfile.first_name}
              className="col-span-3"
              onChange={(e) => setNewProfile({...newProfile!, first_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input id="last_name"
              value={newProfile.last_name}
              className="col-span-3"
              onChange={(e) => setNewProfile({...newProfile!, last_name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input id="Role"
              value={newProfile.role}
              className="col-span-3"
              onChange={(e) => setNewProfile({...newProfile!, role: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email"
              value={newProfile.email}
              className="col-span-3"
              onChange={(e) => setNewProfile({...newProfile!, email: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const updateProfileContent = (
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
  );

  const deleteProfileContent = (
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
  );
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <div>
            <CircleUserRound className={"w-10 p-0 m-0"}/>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{profile?.first_name || ""} {profile?.last_name || ""}</CardTitle>
            <Badge variant="secondary" className="mt-1">{profile?.role || ""}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-sm">{profile?.email || ""}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p className="text-sm capitalize">{profile?.role || ""}</p>
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