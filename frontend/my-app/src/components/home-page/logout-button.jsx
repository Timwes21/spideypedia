export default function LogoutButton(){
    function logout(){
        localStorage.removeItem("comicManagementToken");
        window.location.reload();
    }

    return(
        <button id="logout-button" onClick={ logout }>Logout</button>
    )
}