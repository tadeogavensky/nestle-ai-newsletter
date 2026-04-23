import { Fragment, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Header from './components/Header.tsx'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import CreatePage from "./pages/CreatePage.tsx";
import theme from './styles/nestleMuiTheme.ts'

const router = createBrowserRouter([
  {
    element: (
      <Fragment>
        <Header />
        <Outlet />
      </Fragment>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/crear",
        element: <CreatePage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
