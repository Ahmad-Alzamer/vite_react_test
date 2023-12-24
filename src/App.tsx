import './App.scss'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from "./UI/pages/error/Error.tsx";
import {Users} from "./UI/pages/users/Users.tsx";
import Layout from "./UI/pages/Layout.tsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <Layout><ErrorPage/></Layout>,
        children:[
            {
                path: "Users",
                element: <Users />,
            },
        ]
    },

]);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}
export default App
