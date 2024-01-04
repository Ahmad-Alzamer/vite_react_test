import './App.scss'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from "./UI/pages/error/Error.tsx";
import {Users} from "./UI/pages/users/Users.tsx";
import Layout from "./UI/pages/Layout.tsx";
import {NewUser} from "./UI/pages/NewUser/NewUser.tsx";
import {TestSuspense} from "./UI/pages/TestSuspense/TestSuspense.tsx";
import {ZodValidation} from "./UI/pages/zodValidation/ZodValidation.tsx";



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
            {
                path: "TestSuspense",
                element: <TestSuspense />,
            },{
                path: "ZodValidation",
                element: <ZodValidation />,
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
