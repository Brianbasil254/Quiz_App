Here’s a README file for the quiz application project:

---

# **Quiz Application**

A quiz application where users can test their knowledge on various topics, while admins can manage quizzes by adding questions and viewing user results.

## **Table of Contents**
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

---

## **Description**

This quiz application allows users to log in, take quizzes, and view their scores at the end. Admins have additional functionality to add new questions, view results of all users, and manage quizzes. This app is built with Node.js, Express, MySQL, and JWT authentication.

---

## **Features**

- **User Registration & Login:** Users can register and log in securely with hashed passwords.
- **Quiz Functionality:** Users can take quizzes and view their results upon completion.
- **Admin Panel:** Admins can add new quiz questions and view the results of all users.
- **JWT Authentication:** Users are authenticated using JSON Web Tokens (JWT).
- **Local Storage:** Quiz questions are cached in local storage for smoother performance.

---

## **Installation**

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Brianbasil254/quiz-app.git
   cd quiz-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MySQL database:**
   - Create a MySQL database and import the provided SQL file.
   - Update the MySQL credentials in `config/db.js`.

4. **Start the server:**
   ```bash
   node index.js
   ```

5. **Access the app:**
   - Open your browser and navigate to `http://localhost:3000`.

---

## **Usage**

1. **User Registration:**
   - Visit `/register.html` to create a new account.
   - After registering, log in using `/login.html`.

2. **Taking a Quiz:**
   - After logging in, you will be directed to the quiz page to start answering questions.
   - The score is calculated at the end of the quiz.

3. **Admin Features:**
   - If logged in as an admin, you can add questions via `/add_questions.html`.
   - You can also view the results of all users at `/view_all_results.html`.

---

## **API Endpoints**

- **`POST /api/register`**: Register a new user.
- **`POST /api/login`**: Login and receive a JWT token.
- **`GET /api/questions`**: Get all quiz questions (protected).
- **`POST /api/results`**: Submit quiz results (protected).
- **`GET /api/admin/results`**: Admin can view all user results (protected).

---

## **Technologies Used**

- **Backend**: Node.js, Express, MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: JWT (JSON Web Token)
- **Database**: MySQL
- **Libraries**: bcryptjs (for password hashing), body-parser, cors

---

## **License**

This project is licensed under the MIT License.

---

## **Contributing**

Feel free to contribute! Here’s how:
1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## **Contact**

For any inquiries, feel free to reach out to:
- **GitHub**: Brianbasil254(https://github.com/Brianbasil254)

---

This README provides clarity for users and contributors to understand your project and get started quickly. Let me know if you’d like any adjustments!
