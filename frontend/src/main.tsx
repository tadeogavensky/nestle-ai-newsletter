import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import './index.css'
import App from './App.tsx'
import theme from './styles/nestleMuiTheme.ts'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Dashboard from './pages/Dashboard.tsx'

const router = createBrowserRouter([
    {
        path: "/dashboard",
        element: <Dashboard />, // This should act as your layout (containing Navbar, <Outlet />, etc.)
    },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);