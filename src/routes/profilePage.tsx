import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard'; 
import { useAuth } from '@/context/AuthContext';
import api from "@/lib/api/api.ts";
interface User {
  First_Name: string;
  Last_Name: string;
  email: string;
  role: string;
}
/* interface User {
  name: string;
  email: string;
  role: string;
} */

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser } = useAuth();
  

   /* useEffect(() => {
    setUser({name: 'John Doe', email: 'johndoe@gmail.com', role: 'admin'});
  }, []);  */

  /* useEffect(() => {
    const userID = authUser?.userId;

    const getDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/profiles/${userID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser({ First_Name: response.data.first_name, Last_Name: response.data.last_name, email: response.data.email, role: response.data.role });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    getDetails();
  }, []);  */

  useEffect(() => {
    const userID = authUser?.userId;
    api.get(`/profiles/${userID}`)
        .then(response => {
          console.log(response.data);
            setUser({ First_Name: response.data.first_name, Last_Name: response.data.last_name, email: response.data.email, role: response.data.role });
        })
        .catch(error => {
            console.error("Error fetching order types:", error);
        });
}, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Page</h1>
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;