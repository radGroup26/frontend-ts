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
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const userID = authUser?.userId;
  const [profile, setProfile] = useState<Profile>({
    _id: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    userId: userID
  });
  const [newProfile, setNewProfile] = useState<Profile>({
    _id: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    userId: userID
  });
  const [updateProfile, setUpdateProfile] = useState<Profile>({
    _id: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    userId: userID
  });
  const [deleteProfile, setDeleteProfile] = useState<Profile>({
    _id: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    userId: userID
  });

  useEffect(() => {
    api.get(`/profiles/${userID}`)
        .then(response => {
            setProfile(response.data);
        })
        .catch(error => {
            console.error("Error fetching profile:", error);
        });
}, [newProfile, updateProfile, deleteProfile]);
const { toast } = useToast();

const validateProfile = (profile) => {
  if (!profile.first_name) {
      toast({
          title: "Invalid First Name",
          description: "Please enter a valid first name for profile."
      });
      return false;
  } else if (!profile.last_name) {
      toast({
          title: "Invalid Last Name",
          description: "Please enter a valid last name for profile."
      });
      return false;
  } else if (!profile.role) {
      toast({
          title: "Invalid Role",
          description: "Please enter a valid role or profile."
      });
      return false;
  } else {
      return true;
  }
}

const handleCreateProfile = (e) => {
  e.preventDefault()
  if (validateProfile(newProfile)) {
      api.post('/profiles/create', newProfile )
          .then(response => {
              toast({
                  title: "Profile created successfully",
              });
              setNewProfile({...newProfile, first_name: "", last_name: "", role: "", email: ""});
          })
          .catch(error => {
              console.error('Error creating profile:', error);
          });
  }
}
const handleUpdateProfile = (e) => {
  e.preventDefault()
  if (validateProfile(updateProfile)) {
      api.post('/profiles/update', updateProfile )
          .then(response => {
              toast({
                  title: "Profile Updated",
              });
              setUpdateProfile({...updateProfile, first_name: "", last_name: "", role: "", email: ""});
          })
          .catch(error => {
              console.error('Error editing item:', error);
          });
  }
}

const handleDeleteProfile = (e) => {
  e.preventDefault()
  if (!deleteProfile.userId) {
      toast({
          title: "Invalid Profile",
          description: "Please select a valid profile to delete."
      });
      return;
  }

  api.post('/profiles/delete',  {userId: deleteProfile.userId}  )
      .then(response => {
          toast({
              title: "Profile Deleted",
          });
          setDeleteProfile({...deleteProfile, first_name: "", last_name: "", role: "", email: ""});
      })
      .catch(error => {
          console.error('Error deleting Profile:', error);
      });
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
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="first_name" className="text-right">
                      First Name
                  </Label>
                  <Input id="first_name"
                         value={' '}
                         className="col-span-3"
                         onChange={(e) => setNewProfile({...newProfile, first_name: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_name" className="text-right">
                      Last Name
                  </Label>
                  <Input id="last_name"
                         value={' '}
                         className="col-span-3"
                         onChange={(e) => setNewProfile({...newProfile, last_name: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                      Role
                  </Label>
                  <Input id="Role"
                         value={' '}
                         className="col-span-3"
                         onChange={(e) => setNewProfile({...newProfile, role: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                      Email
                  </Label>
                  <Input id="email"
                         value={' '}
                         className="col-span-3"
                         onChange={(e) => setNewProfile({...newProfile, email: e.target.value})}
                  />
              </div>
          <DialogFooter>
              <Button onClick={handleCreateProfile}>Create</Button>
          </DialogFooter>
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
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="first_name" className="text-right">
                      First Name
                  </Label>
                  <Input id="first_name"
                         value={updateProfile.first_name || ' '}
                         className="col-span-3"
                         onChange={(e) => setUpdateProfile({...updateProfile, first_name: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_name" className="text-right">
                      Last Name
                  </Label>
                  <Input id="last_name"
                         value={updateProfile.last_name || ' '}
                         className="col-span-3"
                         onChange={(e) => setUpdateProfile({...updateProfile, last_name: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                      Role
                  </Label>
                  <Input id="Role"
                         value={updateProfile.role || ' '}
                         className="col-span-3"
                         onChange={(e) => setUpdateProfile({...updateProfile, role: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                      Email
                  </Label>
                  <Input id="email"
                         value={updateProfile.email || ' '}
                         className="col-span-3"
                         onChange={(e) => setUpdateProfile({...updateProfile, email: e.target.value})}
                  />
              </div>
          <DialogFooter>
              <Button onClick={handleUpdateProfile}>Update</Button>
          </DialogFooter>
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
                  All of your profile data will be permenantly deleted.
                  Do you wish to continue?
              </DialogDescription>
          </DialogHeader>
          <DialogFooter>
              <Button onClick={handleDeleteProfile}><span className='red'>Delete</span></Button>
          </DialogFooter>
        </DialogContent>
  </Dialog>
)

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