import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children: [
            {
                path: '/',
                Component:Home
            },
            {
                path: '/login',
                Component:Login
            },
            {
                path: 'signup',
                Component:Register
            }
        ]
    },
]);





export default router;