// DOM Elements
const startbtn = document.querySelector(".start_btn");
const infoBox = document.querySelector(".info_box");
const quizBox = document.querySelector(".quiz_box");
const continuebtn = document.querySelector(".continue_btn");
const exitbtn = document.querySelector(".quit_btn");
const questext = document.querySelector(".que_text");
const nextbtn = document.querySelector(".next_btn");
const optionList = document.querySelector('.option_list');
const totalQues = document.querySelector(".total_que");
const timeCount = document.querySelector(".timer_sec");
const resultBox = document.querySelector(".result_box");
const restartbtn = document.querySelector(".result_buttons .restart");
const quitbtn = document.querySelector(".result_buttons .quit");
const scoreText = document.querySelector(".score_text");
const scoreIcon = document.querySelector(".icon");
const explanationText = document.querySelector(".explanation");  // Ensure this is defined in your HTML

// Variables
let timecount;
let timeValue = 15;
let currentQuestionIndex = 0;
let userScore = 0;
let quizquestions = [];
let selectedAnswerIndex = null;  // Track which option was selected

// Start button event
startbtn.addEventListener("click", function () {
    infoBox.classList.add("Info_active");
});

// Exit button event
exitbtn.addEventListener("click", function () {
    infoBox.classList.remove("Info_active");
});

// Quit button event
quitbtn.addEventListener("click", function () {
    window.location.reload();
});

// Timer function
function startTime(time) {
    clearInterval(timecount);
    timecount = setInterval(function() {
        if (time >= 0) {
            let min = Math.floor(time / 60);
            let sec = time % 60;
            timeCount.innerText = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
            time--;
        } else {
            clearInterval(timecount);
            nextquestion();  // Move to the next question when time is up
        }
    }, 1000);
}

// Continue button event
continuebtn.addEventListener("click", function () {
    infoBox.classList.remove("Info_active");
    quizBox.classList.add("Quiz_active");
    showQuestion(currentQuestionIndex);
    startTime(timeValue);
    questionCounter(currentQuestionIndex + 1); // Start counting from 1
});

// Restart button event
restartbtn.addEventListener("click", function () {
    currentQuestionIndex = 0;  
    userScore = 0;
    resultBox.classList.remove("result_active");
    quizBox.classList.add("Quiz_active");
    showQuestion(currentQuestionIndex);
    startTime(timeValue);
    questionCounter(currentQuestionIndex + 1);
    nextbtn.style.display = "none";
});

// Next button event
nextbtn.addEventListener("click", function () {
    if (selectedAnswerIndex !== null) {
        nextquestion();
    } else {
        alert("Please select an option before moving to the next question!");
    }
});

// Next question function
function nextquestion() {
    // Increment the current question index
    currentQuestionIndex++;
    
    // Debug log to check current question index and total questions
    console.log("Current Question Index:", currentQuestionIndex);
    console.log("Total Questions:", quizquestions.length);
    
    // Check if there are more questions
    if (currentQuestionIndex < quizquestions.length) {
        showQuestion(currentQuestionIndex);
        questionCounter(currentQuestionIndex + 1); // Display the next question number
        clearInterval(timecount); // Clear the old timer
        startTime(timeValue); // Restart the timer for the next question
        nextbtn.style.display = "none"; // Hide the Next button until an option is selected
    } else {
        // All questions have been answered, show results
        showresultBox();
    }
}


// Show result box
function showresultBox() {
    quizBox.classList.remove("Quiz_active");
    resultBox.classList.add("result_active");

    const totalQuestions = quizquestions.length;
    let scoreTag;

    if (userScore > totalQuestions * 0.8) {
        scoreTag = `<p>Congrats, You got ${userScore} out of ${totalQuestions}!</p>`;
    } else if (userScore > totalQuestions * 0.5) {
        scoreTag = `<p>Nice, You got ${userScore} out of ${totalQuestions}!</p>`;
        scoreIcon.innerHTML = `<i class="far fa-thumbs-up"></i>`;
    } else {
        scoreTag = `<p>Try again, You got ${userScore} out of ${totalQuestions}!</p>`;
        scoreIcon.innerHTML = `<i class="far fa-sad-cry"></i>`;
    }
    scoreText.innerHTML = scoreTag;
}

// Show question function
function showQuestion(index) {
    const currentQuestion = quizquestions[index];

    // Hide the explanation text when moving to the next question
    explanationText.style.display = "none"; 

    questext.innerHTML = `
        <div class="question">
            <span>${currentQuestion.id}. ${currentQuestion.question}</span>
        </div>`;

    // Combine options
    const options = [currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d];

    if (options && options.length > 0) {
        let optiontag = `
        <div class="option"><span>A</span> ${options[0]}</div>
        <div class="option"><span>B</span> ${options[1]}</div>
        <div class="option"><span>C</span> ${options[2]}</div>
        <div class="option"><span>D</span> ${options[3]}</div>`;

        optionList.innerHTML = optiontag;

        // Add event listeners to each option
        const optionElements = optionList.querySelectorAll(".option");
        optionElements.forEach((option, idx) => {
            option.addEventListener("click", () => optionSelected(option, idx));
        });
    } else {
        console.error("Options are missing or empty for the current question.");
        optionList.innerHTML = `<div class="option">No options available for this question.</div>`;
    }
}

// Option selected function
function optionSelected(answer, idx) {
    clearInterval(timecount);
    selectedAnswerIndex = idx;  // Store the selected answer index

    let selectedOption = answer.textContent.trim().slice(1).toLowerCase();
    let correctAnswer = quizquestions[currentQuestionIndex].answer.toLowerCase();

    if (selectedOption === correctAnswer) {
        userScore++;
        answer.classList.add("correct");
    } else {
        answer.classList.add("incorrect");
        // Highlight the correct option
        optionList.querySelectorAll(".option").forEach(option => {
            if (option.textContent.trim().slice(1).toLowerCase() === correctAnswer) {
                option.classList.add("correct");
            }
        });
    }

    // Disable all options
    optionList.querySelectorAll(".option").forEach(option => option.classList.add("disabled"));

    // Show explanation
    explanationText.innerHTML = `<p>${quizquestions[currentQuestionIndex].explanation}</p>`;
    explanationText.style.display = "block";  // Show the explanation
    nextbtn.style.display = "block";  // Show the next button
}

// Question counter
function questionCounter(index) {
    totalQues.innerHTML = `${index} of ${quizquestions.length} Questions`;
}

// Fetch questions from API or local storage
window.onload = async function () {
    let storedQuestions = JSON.parse(localStorage.getItem('quizquestions'));

    if (storedQuestions && storedQuestions.length > 0) {
        quizquestions = storedQuestions;
    } else {
        const response = await fetch('http://localhost:3000/api/questions');
        const data = await response.json();
        console.log("Fetched Questions Data:", data);
        quizquestions = data;
        localStorage.setItem('quizquestions', JSON.stringify(quizquestions));
    }

    console.log("Quiz Questions Array:", quizquestions);

    if (quizquestions.length > 0) {
        showQuestion(0);
    } else {
        console.log("No questions found.");
    }
};