import { useState } from "react";
import { routesMap } from "../routes.js";

export default function LoginForm(){
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ phoneNumber, setPhoneNumber ] = useState("");
    const [ creatingAccount, setCreatingAccount ] = useState(false);
    const [ loginMessage, setLoginMessage ] = useState("");
    const [ createAccountMessage, setCreateAccountMessage] = useState("");

    function submitUser(){
        if (username.length < 6 || password.length < 6){
            setCreateAccountMessage("Username and Password must be greater than 6 characters");
            return;
        }
        
        fetch(routesMap.createUser, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password, email, phoneNumber})
        })
        .then(async(response) => {
            console.log(response);
            const status = response.status;
            const data = await response.json();
            console.log(data.message);
            if (status === 200){
                
                localStorage.setItem("comicManagementToken", data.token);
                window.location.reload();
                return data.message;
            }
        })
        .then(message=>{
            setCreateAccountMessage(message);
        })
        .catch(err=>{
            console.log(err);
            setCreateAccountMessage("There was an error");
        })
    }

    function login(){
        fetch(routesMap.login, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })
        .then(async(response)=>{
            const status = response.status;
            const data = await response.json()
            console.log(response);
            
            console.log("here is the data", data);
            if (status == 200){
                const { message, token } = data;
                console.log(message);
                localStorage.setItem("comicManagementToken", token);
                fetch()
                window.location.reload();
            }
            else{
                setLoginMessage(data.message);
            }
        })
        .catch(err=>{
            console.log(err);
            setLoginMessage("There was an issue, try again later");
        })
    }





    const createAccountContent = (
            <div className="create">
                <h1 className="auth-heading">Create Account</h1>
                <div className="credentials">
                    <div className="credential">
                        <label htmlFor="">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="credential">
                        <label htmlFor="">Password</label>
                        <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                    </div>
                    <div className="credential">
                        <label htmlFor="">Email</label>
                        <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    </div>
                    <div className="credential">
                        <label htmlFor="">Phone Number</label>
                        <input type="text" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
                    </div>
                    <p className="message">{ createAccountMessage }</p>
                    <button onClick={submitUser}>Submit</button>
                    <p className="message">Already have an account? <span id="login-link" onClick={() => setCreatingAccount(false) }>Log In</span></p>
                </div>
            </div>
    )

    const loginContent = (
            <div className="login">
                <h1 className="auth-heading">Login</h1>
                <div className="credentials">
                    <div className="credential">
                        <label htmlFor="">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="credential">
                        <label htmlFor="">Password</label>
                        <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                    </div>
                    <p className="message">{ loginMessage }</p>
                    <button onClick={ login }>Log in</button>
                    <p className="message">Don't have an Account? <span id="login-link" onClick={ () => setCreatingAccount(true) }>Create Account</span></p>
                </div>
            </div>
    )

    return(
       <div className="auth-body">
           {creatingAccount? createAccountContent: loginContent}
       </div>
    ) 
}