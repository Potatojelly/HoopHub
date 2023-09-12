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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <NotFound/>,
    children: [
      {index:true, path:"/", element: <Forums/>},
      {path:"/people", element: <People/>},
      {path:"/messages", element: <Messages/>},
      {path:"/find-chat-rooms", element: <FindChatRooms/>},
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
  </RouterProvider>
);

