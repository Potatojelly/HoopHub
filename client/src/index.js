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
import { ChatRoomProvider } from './context/ChatRoomContext';
import ChatService from './service/chat';
import { UserSearchProvider } from './context/UserSearchContext';
import ChatScreen from './components/Chat/ChatScreen';
import UserSearch from './components/Chat/UserSearch';
import ChatInbox from './components/Chat/ChatInbox';
import Post from './components/Forum/Post';
import Posts from './components/Forum/Posts';
import ViewPost from './pages/ViewPost';
import { PostProvider } from './context/PostContext';
import { MyActivityProvider } from './context/MyActivityContext';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const authService = new AuthService(httpClient);
const profileService = new ProfileService(httpClient);
const retrieveService = new RetrieveService(httpClient);
const searchService = new SearchService(httpClient);
const friendService = new FriendService(httpClient);
const postService = new PostService(httpClient);
const chatService = new ChatService(httpClient);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (<QueryClientProvider client={queryClient}>
                <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
                  <ProfileProvider profileService={profileService}>
                    <ChatRoomProvider>
                      <PostProvider>
                        <App  friendService={friendService}/>
                      </PostProvider>
                    </ChatRoomProvider>
                  </ProfileProvider>
                </AuthProvider>
                {/* <ReactQueryDevtools initialIsOpen={true}/> */}
              </QueryClientProvider>),
    errorElement: <NotFound/>,
    children: [
      {index:true, 
        path:"/", 
        element:(<Forums postService={postService}/>)
      },
      {
        path:"/people", 
        element: (<ProtectedRoute>
                    {/* <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}> */}
                      <People searchService={searchService} friendService={friendService}/>
                    {/* </AuthProvider> */}
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
                    <ProfileProvider profileService={profileService}>
                      {/* <ChatRoomProvider> */}
                        <UserSearchProvider>
                          <Messages searchService={searchService} chatService={chatService}/>
                        </UserSearchProvider>
                      {/* </ChatRoomProvider> */}
                    </ProfileProvider>
                  </ProtectedRoute>),
        children:[
          {
            path:"inbox",
            element: (<ChatInbox/>)
          },
          {
            path:"search-user",
            element: (<UserSearch searchService={searchService} />)
          },
          {
            path:":title",
            element: (<ChatScreen chatService={chatService}/>)
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
                  <ProfileProvider profileService={profileService}>
                    {/* <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}> */}
                        <ProfileProvider profileService={profileService}>
                          <EditProfile/>
                        </ProfileProvider>
                      {/* </AuthProvider> */}
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
        path:"/forums", 
        element: (<ProtectedRoute>
                      <Forums postService={postService}/>
                  </ProtectedRoute>),
        children:
        [
          {
            path:"post/:title",
            element: (<MyActivityProvider>
                        <Post postService={postService}/>
                      </MyActivityProvider>)
          }
        ]
      },
      {
        path:"/forums/search/:keyword", 
        element: (<ProtectedRoute>
                      <Forums postService={postService}/>
                  </ProtectedRoute>)
      },
      {
        path:"/manage-my-activity", 
        element: (<ProtectedRoute>
                      <SelectedCardProvider>
                          <MyActivity postService={postService}/>
                      </SelectedCardProvider>
                  </ProtectedRoute>),
        // children: [
        //   {
        //     path:"my-post/:title", 
        //     element: (<ProtectedRoute>
        //                 <MyPost postService={postService}/>
        //               </ProtectedRoute>)
        //   },
        // ]
      },
      {
        path:"/manage-my-activity/my-post/:title", 
        element: (<ProtectedRoute>
                    <SelectedCardProvider>
                      <MyActivityProvider>
                        <MyPost postService={postService}/>
                      </MyActivityProvider>
                    </SelectedCardProvider>
                  </ProtectedRoute>)
      },
    ]
  },
  {
    path: "/login",
    element:(<AuthProvider authService={authService} >
              <Login/>
            </AuthProvider>)
  },
  {
    path: "/register",
    element: (<AuthProvider authService={authService} >
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

