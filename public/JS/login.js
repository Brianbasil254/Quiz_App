document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = { username, password };

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            localStorage.setItem("token", result.token); // Store JWT in local storage
            const decodedToken = JSON.parse(atob(result.token.split('.')[1])); // Decode JWT to check role

            // Redirect based on role
            if (decodedToken.role === "admin") {
                window.location.href = "/add_questions.html"; // Redirect admin to add questions
            } else {
                window.location.href = "/quiz.html"; // Redirect users to quiz page
            }
        } else {
            document.getElementById("loginError").textContent = result.message;
        }
    } catch (error) {
        document.getElementById("loginError").textContent = "An error occurred during login.";
    }
});
