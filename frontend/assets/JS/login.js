document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const userData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", data.token); 
                localStorage.setItem("role", data.user.role); // Use data.user.role instead

                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("rememberMe", "true");
                    localStorage.setItem("email", userData.email);
                } else {
                    localStorage.removeItem("rememberMe");
                    localStorage.removeItem("email");
                }

                // Redirect based on role
                if (data.user.role === "artisan") {  // Adjusted to data.user.role
                    window.location.href = "/frontend/pages/artisan-dashboard.html";
                } else if (data.user.role === "customer") {  // Adjusted to data.user.role
                    window.location.href = "/frontend/pages/customer-dashboard.html";
                } else {
                    alert("Invalid role detected.");
                }
            } else {
                alert(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });

    // Autofill email if "Remember Me" was checked before
    if (localStorage.getItem("rememberMe") === "true") {
        document.querySelector("input[name='email']").value = localStorage.getItem("email") || "";
        rememberMeCheckbox.checked = true;
    }
});
