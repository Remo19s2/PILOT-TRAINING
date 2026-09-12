import { BrowserRouter } from 'react-router-dom'
import { WorkflowProvider } from './context/WorkflowContext'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <WorkflowProvider>
        <AppRouter />
      </WorkflowProvider>
    </BrowserRouter>
  )
}

export default App
