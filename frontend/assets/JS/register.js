document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const roleSelection = document.getElementById("role-selection");
    const roleInput = document.getElementById("role");
    const backButton = document.querySelector(".small-back-btn");

    window.selectRole = function (role) {
        roleInput.value = role;
        roleSelection.style.display = "none";
        registerForm.style.display = "block";

        document.querySelectorAll(".artisan-only").forEach(el => {
            el.style.display = role === "customer" ? "none" : "block";
        });
    };

    window.goBack = function () {
        roleSelection.style.display = "flex";
        registerForm.style.display = "none";
    };

    function handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(document.getElementById("register-form"));
        const fileInput = document.querySelector("input[name='profileImage']");
        
        console.log("FormData Debug:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]); // Check what is actually being sent
        }
    
        fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registration successful!");
                window.location.href = "../../pages/login.html";
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    
    registerForm.addEventListener("submit", handleFormSubmit);
});
