
        function login(){
            let user = document.getElementById("user-name").value;
            let pass = document.getElementById("user-password").value;

            if(user === "2500032036@kluniversity" && pass === "hemaang sahay 008"){
                window.location.href = "index.html";  // Redirect to tasks page
            } 
            else{
                alert("Invalid username or password!");
            }
        }
        
    