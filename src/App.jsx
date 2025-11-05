import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ShippingReturnsPage from './pages/ShippingReturnsPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import './App.css'

// Get basename for GitHub Pages
// If deployed at username.github.io/repo-name, extract repo-name
// If deployed at username.github.io (root), use '/'
function getBasename() {
  const path = window.location.pathname
  
  // Extract repo name from path (e.g., /repo-name/ -> /repo-name)
  const pathMatch = path.match(/^\/([^\/]+)\//)
  if (pathMatch && pathMatch[1] !== 'assets' && pathMatch[1] !== 'static') {
    return `/${pathMatch[1]}`
  }
  
  return '/'
}

function App() {
  return (
    <Router basename={getBasename()}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

