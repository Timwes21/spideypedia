import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/home-page.css'
import './style/auth.css'
import LoginForm from './components/login-page/login-form.jsx'
import { NavBar } from './components/home-page/nav-bar.jsx'
import HomeBody from './components/home-page/home-body.jsx'


function homePage(){
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <NavBar/>
    <HomeBody />
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