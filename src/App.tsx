import './App.scss'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from "./UI/pages/error/Error.tsx";
import {Users} from "./UI/pages/users/Users.tsx";
import Layout from "./UI/pages/Layout.tsx";
import {NewUser} from "./UI/pages/NewUser/NewUser.tsx";



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
            {
                path: "NewUser",
                element: <NewUser />,
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
