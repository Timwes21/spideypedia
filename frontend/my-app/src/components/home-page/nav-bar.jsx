import { authBase } from "../../routes";

export function NavBar(){
    function logout(){
        localStorage.getItem("comicManagementToken");
        fetch(authBase + "/logout", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken")})
        })
        .then(()=>{
            localStorage.removeItem("comicManagementToken");
            window.location.reload();
        })
        .catch(err=>console.log("something went wrong", err))
    }

    return(
        <nav>
            <h1 id="title">SPIDEYPEDIA</h1>
            {/* <div className="nav-contents">
                <h4 className="nav-button">Home</h4>
                <h4 className="nav-button">Profile</h4>
            </div> */}
            <h5 id="logout" className="nav-button" onClick={ logout }>Logout</h5>
        </nav>
    )
}