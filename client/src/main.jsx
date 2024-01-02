import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App'
import ErrorPage from './pages/ErrorPage'
import SearchBooks from './pages/SearchBooks'
import LoginForm from './pages/LoginForm'
import SignupForm from './pages/SignupForm'
import SavedBooks from './pages/SavedBooks'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SearchBooks />
      }, {
        path: '/login',
        element: <LoginForm />
      }, {
        path: '/signup',
        element: <SignupForm />
      }, {
        path: '/savedbooks',
        element: <SavedBooks />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
