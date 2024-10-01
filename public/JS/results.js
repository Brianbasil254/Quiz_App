window.onload = async function () {
    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
        const response = await fetch("/api/admin/results", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Send the token for verification
            }
        });

        const results = await response.json();
        if (results.success === false) {
            alert(results.message); // Handle access denied or other messages
            return;
        }

        const tbody = document.getElementById("resultsTable").querySelector("tbody");

        results.forEach(result => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${result.username}</td>
                <td>${result.score}</td>
                <td>${result.total_questions}</td>
                <td>${new Date(result.date_taken).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching results:", error);
    }
};

// Logout function
function logout() {
    localStorage.removeItem('token'); // Remove the token
    window.location.href = '/login.html'; // Redirect to login
}
