import React from 'react'

//router
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//context
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';

//styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

//component
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Register from './component/login/Register.jsx';
import Login from './component/login/Login.jsx';
import Home from './component/Home.jsx';
import Album from './component/Album.jsx';
import AddLabel from './component/AddLabel.jsx'

//create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: '/addLabel',
    element: <AddLabel />
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
);