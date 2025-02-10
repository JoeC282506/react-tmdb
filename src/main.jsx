/* import { StrictMode } from 'react' */
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode> 停用 防止useEffect行2次 
    <App />
  
)
