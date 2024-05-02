import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NewTransactionPage from "@/pages/new-transaction/NewTransactionPage";
import TransactionsPage from "@/pages/transactions/TransactionsPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import NewCategoryPage from "@/pages/new-category/NewCategoryPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute element={<AuthLayout />} />,
    children: [
      {
        path: "/login",
        element: <SignInPage />,
      },
      {
        path: "/register",
        element: <SignUpPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
  {
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
      },
      {
        path: "/transactions/new",
        element: <NewTransactionPage />,
      },
      {
        path: "/transactions/:id",
        element: <NewTransactionPage />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/categories/new",
        element: <NewCategoryPage />,
      },
      {
        path: "/categories/:id",
        element: <NewCategoryPage />,
      },
    ],
  },
]);

export default router;
