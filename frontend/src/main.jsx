import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/home-page.css'
import './style/auth.css'
import LoginForm from './login-form.jsx'
import { NavBar } from './components/nav-bar.jsx'
import HomeBody from './home-body.jsx'


function homePage(){
  createRoot(document.getElementById('root')).render(
    <>
      <NavBar/>
      <HomeBody />
    </>
)
}

function LoginPage(){
  createRoot(document.getElementById('root')).render(
    <LoginForm/>
  )
}



const token = localStorage.getItem("comicManagementToken");
token? homePage(): LoginPage();