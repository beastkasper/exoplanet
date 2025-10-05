import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/AppRouter.tsx'
import { ParallaxProvider } from 'react-scroll-parallax'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ParallaxProvider>
    <RouterProvider router={router} />
    </ParallaxProvider>
  </StrictMode>,
)
