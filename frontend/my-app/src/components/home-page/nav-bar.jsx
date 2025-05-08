export function NavBar(){
    function logout(){
        localStorage.removeItem("comicManagementToken");
        window.location.reload();
    }
    console.log(localStorage.getItem("comicManagementToken"));
    

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