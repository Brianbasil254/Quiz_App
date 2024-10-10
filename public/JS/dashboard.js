  // Check if the user is logged in by checking the token
  const token = localStorage.getItem('token');
  if (!token) {
      // If no token is found, redirect to login.html
      window.location.href = 'login.html';
  }

  // Button to redirect to the quiz
  document.getElementById('quizBtn').addEventListener('click', function () {
      window.location.href = 'quiz.html';
  });

  // Button to redirect to the results page (only for admins)
  document.getElementById('resultsBtn').addEventListener('click', function () {
      // Make sure the user has admin role
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      if (tokenPayload.role === 'admin') {
          window.location.href = 'results.html';
      } else {
          alert('You do not have permission to view results.');
      }
  });

  // Button to logout
  document.getElementById('logoutBtn').addEventListener('click', function () {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
  });