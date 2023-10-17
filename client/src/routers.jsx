
import App from './App.jsx'
import './index.css'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import { UserProvider } from './providers/userContext.js'
import React, { useState } from 'react'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Profile from './components/Profile.jsx'
import CatProfile from './components/CatProfile.jsx'
import CatList from './components/CatList.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import AddCat from './components/addCat.jsx'
import Post from './components/Post.jsx'
import PostPage from './components/PostPage.jsx'
import EditProfile from './components/EditProfile.jsx'

const queryClient = new QueryClient();


function Routers () {
  const [user, setUser] = useState(null);

  
  const Layout = () => {
    return (
      <>
    <Nav />
    <Outlet />
    </>
  )
}


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
      element: <Login />,
    },
])

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