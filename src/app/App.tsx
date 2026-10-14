import { RouterProvider } from '@tanstack/react-router'
import { AppStateProvider } from './model/AppStateContext'
import { router } from './router'

function App() {
  return (
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  )
}

export default App
