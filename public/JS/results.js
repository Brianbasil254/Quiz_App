async function fetchResults() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("You need to log in as admin to view the results.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/admin/results', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            alert("Access denied.");
            window.location.href = "/login.html";
        }

        const data = await response.json();
        const resultsBody = document.getElementById('resultsBody');

        data.forEach(result => {
            console.log("Result ID:", result.id);
            const row = `<tr>
                <td>${result.username}</td>
                <td>${result.score}</td>
                <td>${result.total_questions}</td>
                <td>${result.date_taken}</td>
                <td><button onclick="deleteResult(${result.id})">Delete</button></td>
            </tr>`;
            resultsBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error("Error fetching results:", error.message);
    }
}

async function deleteResult(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to log in as admin to delete results.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/admin/results/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Result deleted successfully.");
            window.location.reload();  // Refresh the page to update the results
        } else {
            console.error("Error deleting result:", response.statusText);
        }
    } catch (error) {
        console.error("Error deleting result:", error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = "/login.html";
}

window.onload = fetchResults;
