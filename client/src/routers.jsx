
import App from './App.jsx'
import './index.css'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import { UserProvider } from './providers/userContext.js'
import React, { useEffect, useState } from 'react'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Profile from './components/Profile.jsx'
import CatProfile from './components/CatProfile.jsx'
import CatList from './components/CatList.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import AddCat from './components/AddCat.jsx'
import PostPage from './components/PostPage.jsx'
import EditProfile from './components/EditProfile.jsx'
import Facts from './components/Facts.jsx'
import Auth from './services/auth.service.js'
import { set } from 'date-fns'
import { is } from 'date-fns/locale'
import { CircularProgress } from '@mui/material'
import About from './components/About.jsx'
import PageNotFound from './components/404.jsx'

const queryClient = new QueryClient();


function Routers () {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const Layout = () => {
    return (
      <>
    <Nav />
    <Outlet />
    </>
  )
}
useEffect(() => {

  async function checkExistingUserSession() {
    try {
      const user = await Auth.validateSession();
      if (user !== null) {
        setUser(user);
      }
      if (user === null) {
        setUser(null);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  checkExistingUserSession();



}
, []);





const AuthorizedRoute = ({ children }) => {
  if (!user) {
    return <Navigate to="/login" />
  }
  return children;
}



const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthorizedRoute ><Layout /></AuthorizedRoute>,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/cat/:id",
        element: <CatProfile />,
      },
      {
        path: "/cats",
        element: <CatList />,

      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/add-cat",
        element: <AddCat />
      },
      {
        path: "/post/:id",
        element: <PostPage />

      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      {
        path: "/facts",
        element: <Facts />,
      },
      {
        path: "/about",
        element: <About />,
      }
    ],
  },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/logout",
      element: <App />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
])

if (loading) return <div className="loading-container"><CircularProgress /></div>

return (
  <QueryClientProvider client={queryClient}>
  <UserProvider value={{ user, setUser }}>
  <RouterProvider router={router}>
    </RouterProvider>
  </UserProvider>
 <ReactQueryDevtools/> 
    </QueryClientProvider>
 )


}
export default Routers