import React from 'react'
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// import AddLabels from './component/AddLabel.jsx';
// import Video from './component/Video.jsx'
import Canvas from './component/Canvas.jsx';
import Register from './component/Register.jsx';
import Login from './component/Login.jsx';
import ProtectedRoute from './protectedRoute/ProtectedRoute.jsx';
import AddLabel from './component/AddLabel.jsx'
import Home from './component/Home.jsx';
import Video from './component/Video.jsx'

import { UserAuthContextProvider } from './protectedRoute/UserAuthContext.jsx';

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
    path: '/canvas',
    element: <ProtectedRoute><Canvas /></ProtectedRoute>
  },
  {
    path: '/addLabel',
    element: <AddLabel />
  },
  {
    path: '/home',
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: '/video',
    element: <Video />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
);