import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPasswordPage from "@/pages/Forgot/Forgot";
import Home from "@/pages/Home/Home";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

export default routes;
