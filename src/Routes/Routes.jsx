import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Quiz from "../Pages/Quiz/Quiz";
import Leaderboard from "../Pages/Leaderboard/Leaderboard";
import Profile from "../Pages/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children: [
            {
                path: '/',
                Component: Home
            },
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/signup',
                Component: Register
            },
            {
                path: '/quiz',
                Component: Quiz
            },
            {
                path: '/leaderboard',
                Component: Leaderboard
            },
            {
                path: '/profile',
                Component: Profile
            }
        ]
    },
]);

export default router;