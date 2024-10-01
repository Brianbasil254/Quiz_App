document.getElementById("addQuestionForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const question = document.getElementById("question").value;
    const option_a = document.getElementById("option_a").value;
    const option_b = document.getElementById("option_b").value;
    const option_c = document.getElementById("option_c").value;
    const option_d = document.getElementById("option_d").value;
    const answer = document.getElementById("answer").value;
    const explanation = document.getElementById("explanation").value;

    const data = { question, option_a, option_b, option_c, option_d, answer, explanation };

    try {
        const token = localStorage.getItem('token'); // Use the stored token from login
        const response = await fetch("/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Send the token for verification
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert("Question added successfully");
            document.getElementById("addQuestionForm").reset(); // Reset form after success
        } else {
            document.getElementById("addQuestionError").textContent = result.message;
        }
    } catch (error) {
        document.getElementById("addQuestionError").textContent = "An error occurred while adding the question.";
    }
});

// Redirect to quiz page
document.getElementById("toQuizButton").addEventListener("click", function () {
    window.location.href = "/quiz.html"; // Redirect to quiz page
});

// Redirect to results page
document.getElementById("toResultsButton").addEventListener("click", function () {
    window.location.href = "/results.html"; // Redirect to results page
});

