import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const handleMainContentClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="h-screen bg-white flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
        
        <main 
          className="flex-1 p-6 overflow-y-auto"
          onClick={handleMainContentClick}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
