import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/home-page.css'
import './style/auth.css'
import Tables from './components/home-page/Tables.jsx'
import LoginForm from './components/login-page/login-form.jsx'
import LogoutButton from './components/home-page/logout-button.jsx'


function homePage(){
  createRoot(document.getElementById('root')).render(
    <StrictMode>
    <Tables />
  </StrictMode>,
)
}

function LoginPage(){
  createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginForm/>
  </StrictMode>,
  )
}



const token = localStorage.getItem("comicManagementToken");
token? homePage(): LoginPage();