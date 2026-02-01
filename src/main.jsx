import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import router from './Routes/Routes.jsx'
import { RouterProvider } from 'react-router'
import AuthProvider from './Provider/AuthProvider.jsx'

// Initialize theme before React renders
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const theme = savedTheme || "light";
  document.documentElement.setAttribute("data-theme", theme);
};

initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
