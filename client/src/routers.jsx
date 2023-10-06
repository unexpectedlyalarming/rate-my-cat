
import App from './App.jsx'
import './index.css'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import { UserContext, UserProvider } from './providers/userContext.js'
import { useState } from 'react'


function Routers () {
  const [user, setUser] = useState(null)

  
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
      element: <App />,
    },
    {
      path: "/register",
      element: <App />,
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