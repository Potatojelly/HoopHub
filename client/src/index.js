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
import { AuthProvider, initAuthErrorEventBus, getAuthErrorEventBus } from './context/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import EditProfile from './pages/EditProfile';
import ForgotUsername from './pages/ForgotUsername';
import ForgotPassword from './pages/ForgotPassword';
import RetrieveService from './service/retr';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import PostCreate from './pages/PostCreate';
import PostService from './service/post';
import { SelectedCardProvider } from './context/SelectedCardContext';
import { ChatRoomProvider } from './context/ChatRoomContext';
import ChatScreen from './components/Chat/ChatScreen';
import UserSearch from './components/Chat/UserSearch';
import ChatInbox from './components/Chat/ChatInbox';
import ViewPost from './pages/ViewPost';
import { PostProvider } from './context/PostContext';
import { ActivityProvider } from './context/ActivityContext';
import { SocketProvider } from './context/SocketContext';
import ActivityLog from './pages/ActivityLog';
import ActivityPost from './pages/ActivityPost';
import UserActivityLog from './pages/UserActivityLog';

const baseURL = process.env.REACT_APP_BASE_URL;

initAuthErrorEventBus();
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const authService = new AuthService(httpClient);
const retrieveService = new RetrieveService(httpClient);
const postService = new PostService(httpClient);
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (<QueryClientProvider client={queryClient}>
                <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                    <ChatRoomProvider>
                      <PostProvider>
                        <App/>
                      </PostProvider>
                    </ChatRoomProvider>
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={true}/>
              </QueryClientProvider>),
    errorElement: <NotFound/>,
    children: [
      {index:true, 
        path:"/", 
        element:(<Forums />)
      },
      {
        path:"/people", 
        element: (<ProtectedRoute>
                      <People/>
                  </ProtectedRoute>)
      },
      {
        path:"/create-post", 
        element: (<ProtectedRoute>
                      <PostCreate/>
                  </ProtectedRoute>)
      },
      {
        path:"/messages", 
        element: (<ProtectedRoute>
                      <SocketProvider>
                          <Messages/>
                      </SocketProvider>
                  </ProtectedRoute>),
        children:[
          {
            path:"inbox",
            element: (<ChatInbox/>)
          },
          {
            path:"search-user",
            element: (<UserSearch/>)
          },
          {
            path:":title/:chatRoomID",
            element: (<ChatScreen/>)
          }
      ]
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
      {
        path:"/forums", 
        element: (<ProtectedRoute>
                      <Forums/>
                  </ProtectedRoute>),
      },
      {
        path:"/forums/post/:title/:postNum",
        element: (<ActivityProvider>
                    <ViewPost/>
                  </ActivityProvider>)
      },
      {
        path:"/forums/search/:keyword", 
        element: (<ProtectedRoute>
                      <Forums />
                  </ProtectedRoute>)
      },
      {
        path:"/manage-my-activity", 
        element: (<ProtectedRoute>
                    <SelectedCardProvider>
                        <ActivityLog />
                    </SelectedCardProvider>
                  </ProtectedRoute>),
      },
      {
        path:"/manage-my-activity/my-post/:title/:postNum", 
        element: (<ProtectedRoute>
                    <SelectedCardProvider>
                      <ActivityProvider>
                        <ActivityPost postService={postService}/>
                      </ActivityProvider>
                    </SelectedCardProvider>
                  </ProtectedRoute>)
      },
      {
        path:"/view-user-activity/:userNickname", 
        element: (<ProtectedRoute>
                    <SelectedCardProvider>
                      <UserActivityLog />
                    </SelectedCardProvider>
                  </ProtectedRoute>),
      },
    ]
  },
  {
    path: "/login",
    element:(<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
              <PostProvider>
                <Login/>
              </PostProvider>
            </AuthProvider>)
  },
  {
    path: "/register",
    element: (<AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                <Register/>
              </AuthProvider>) 
  },
  {
    path: "/forgot-username",
    element: (<PostProvider>
                <ForgotUsername retrieveService={retrieveService}/>
              </PostProvider>)
  },
  {
    path: "/forgot-password",
    element:(<PostProvider>
              <ForgotPassword retrieveService={retrieveService}/>
            </PostProvider>)
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
  </RouterProvider>
);

