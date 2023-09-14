import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import NotFound from './pages/NotFound';
import Forums from './pages/Forums';
import People from './pages/People';
import Messages from './pages/Messages';
import FindChatRooms from './pages/FindChatRooms';
import Login from './pages/Login';
import Register from './pages/Register';
import HttpClient from './network/http';
import AuthService from './service/auth';
import { AuthProvider, AuthErrorEventBus } from './context/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import EditProfile from './pages/EditProfile';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const authService = new AuthService(httpClient);

const router = createBrowserRouter([
  {
    path: "/",
    element: (<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                <App/>
              </AuthProvider>),
    errorElement: <NotFound/>,
    children: [
      {index:true, path:"/", element: <Forums/>},
      {
        path:"/people", 
        element: (<ProtectedRoute>
                    <People/>
                  </ProtectedRoute>)
      },
      {
        path:"/messages", 
        element: (<ProtectedRoute>
                  <Messages/>
                  </ProtectedRoute>)
      },
      {
        path:"/find-chat-rooms", 
        element: (<ProtectedRoute>
                  <FindChatRooms/>
                  </ProtectedRoute>)
      },
      {
        path:"/edit-profile", 
        element: (<ProtectedRoute>
                  <EditProfile/>
                  </ProtectedRoute>)
      },
      {
        path:"/reset-password", 
        element: (<ProtectedRoute>
                  <ResetPassword/>
                  </ProtectedRoute>)
      },
    ]
  },
  {
    path: "/login",
    element:(<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
              <Login/>
            </AuthProvider>) 
  },
  {
    path: "/register",
    element: (<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
              <Register/>
            </AuthProvider>) 
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
  </RouterProvider>
);

