
import App from './App.jsx'
import './index.css'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import { UserProvider } from './providers/userContext.js'
import { useState } from 'react'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'


function Routers () {
  const [user, setUser] = useState(null);

  
  const Layout = () => {
    return (
      <>
    <Nav />
    <Outlet />
    <Footer />
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
        path: "/cats",
        element: <App />,
      },
      {
        path: "/leaderboard",
        element: <App />,
      },
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
      element: <App />,
    },
])

return (
  <UserProvider value={{ user, setUser }}>
  <RouterProvider router={router}>
    </RouterProvider>
  </UserProvider>
)



}
export default Routers