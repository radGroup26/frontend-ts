import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { AuthProvider } from '@/context/AuthContext';


import Root from './routes/root'
import Register from './routes/register'
import Login from './routes/login';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Dashboard from './routes/dashboard';
import ProfilePage from './routes/profilePage';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Invites from './routes/invites';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<Root />} />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,

      },
      {
        path: "invites",
        element: <ProtectedRoute element={<Invites/>} />,
      },
      {
        path: "account",
        element: <ProtectedRoute element={<ProfilePage />} />,
      }
    ]
  },

  {
    path: "/register",
    element: <GuestRoute element={<Register />} />,
  },
  {
    path: "/login",
    element: <GuestRoute element={<Login />} />,
  }
]);


const queryClient = new QueryClient({})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode >,
)
