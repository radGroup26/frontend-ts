import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard'; 

interface User {
  name: string;
  email: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser({name: 'John Doe', email: 'johndoe@gmail.com', role: 'admin'});
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Page</h1>
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;

