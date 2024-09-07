import React, { useEffect, useState } from 'react';
/* import ProfileCard from '../components/ProfileCard'; */ 
import { useAuth } from '@/context/AuthContext';
import api from "@/lib/api/api.ts";
import { Profile } from '@/types/profile';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile[]>([]);
  const { user: authUser } = useAuth();
  const userID = authUser?.userId;
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
    api.get(`/profiles/?userId=${userID}`)
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        {/* <Avatar className="w-16 h-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback><User className="w-8 h-8" /></AvatarFallback>
        </Avatar> */}
        <div>
          <CardTitle className="text-2xl font-bold">{profile.first_name}</CardTitle>
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
  );
 /*  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Page</h1>
      <ProfileCard profile={profile} />
    </div>
  ); */
};

export default ProfilePage;