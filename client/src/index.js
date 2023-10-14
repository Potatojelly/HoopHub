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
import ForgotUsername from './pages/ForgotUsername';
import ForgotPassword from './pages/ForgotPassword';
import RetrieveService from './service/retr';
import SearchService from './service/search';
import { ProfileProvider } from './context/ProfileContext';
import ProfileService from './service/profile';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import FriendService from './service/friend';
import PostCreate from './pages/PostCreate';
import PostService from './service/post';
import MyActivity from './pages/MyActivity';
import MyPost from './pages/MyPost';
import { SelectedCardProvider } from './context/SelectedCardContext';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const authService = new AuthService(httpClient);
const profileService = new ProfileService(httpClient);
const retrieveService = new RetrieveService(httpClient);
const searchService = new SearchService(httpClient);
const friendService = new FriendService(httpClient);
const postService = new PostService(httpClient);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (<QueryClientProvider client={queryClient}>
                <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                  <ProfileProvider profileService={profileService}>
                    <App  friendService={friendService}/>
                  </ProfileProvider>
                </AuthProvider>
                {/* <ReactQueryDevtools initialIsOpen={true}/> */}
              </QueryClientProvider>),
    errorElement: <NotFound/>,
    children: [
      {index:true, 
        path:"/", 
        element: (<Forums postService={postService}/>)},
      {
        path:"/people", 
        element: (<ProtectedRoute>
                    <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                      <People searchService={searchService} friendService={friendService}/>
                    </AuthProvider>
                  </ProtectedRoute>)
      },
      {
        path:"/create-post", 
        element: (<ProtectedRoute>
                    <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                      <PostCreate postService={postService}/>
                    </AuthProvider>
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
                  <ProfileProvider profileService={profileService}>
                    <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                        <ProfileProvider profileService={profileService}>
                          <EditProfile/>
                        </ProfileProvider>
                      </AuthProvider>
                    </ProfileProvider>
                  </ProtectedRoute>)
      },
      {
        path:"/reset-password", 
        element: (<ProtectedRoute>
                      <ResetPassword/>
                  </ProtectedRoute>)
      },
      {
        path:"/forums/post/:title", 
        element: (<ProtectedRoute>
                      {/* <ReadPost postService={postService}/> */}
                      <Forums postService={postService}/>
                  </ProtectedRoute>)
      },
      {
        path:"/manage-my-activity", 
        element: (<ProtectedRoute>
                      <SelectedCardProvider>
                        <MyActivity postService={postService}/>
                      </SelectedCardProvider>
                  </ProtectedRoute>)
      },
      {
        path:"/manage-my-activity/my-post/:title", 
        element: (<ProtectedRoute>
                    <SelectedCardProvider>
                      <MyPost postService={postService}/>
                    </SelectedCardProvider>
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
  },
  {
    path: "/forgot-username",
    element: <ForgotUsername retrieveService={retrieveService}/>
  },
  {
    path: "/forgot-password",
    element:<ForgotPassword retrieveService={retrieveService}/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
  </RouterProvider>
);

