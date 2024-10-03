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
            const row = `<tr>
                <td>${result.username}</td>
                <td>${result.score}</td>
                <td>${result.total_questions}</td>
                <td>${result.date_taken}</td>
            </tr>`;
            resultsBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error("Error fetching results:", error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = "/login.html";
}

window.onload = fetchResults;
