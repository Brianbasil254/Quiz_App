document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value; // Get selected role

    const data = { username, password, role };

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert("Registration successful");
            window.location.href = "/login.html"; // Redirect to login page
        } else {
            document.getElementById("registerError").textContent = result.message;
        }
    } catch (error) {
        document.getElementById("registerError").textContent = "An error occurred during registration.";
    }
});
