// script.js
document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    {
      question: "What's a simple way to save energy at home?",
      options: ["Leaving lights on", "Unplugging unused chargers", "Using the dryer for all clothes", "Taking long showers"],
      correctAnswer: "Unplugging unused chargers"
    },
    {
      question: "Which of these reduces your carbon footprint?",
      options: ["Driving a car", "Eating more plant-based foods", "Flying often", "Using plastic bags"],
      correctAnswer: "Eating more plant-based foods"
    },
    // Add more questions as needed
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  const quizContainer = document.querySelector('.quiz-container');
  const questionElement = document.getElementById('quiz-question');
  const optionsListElement = document.getElementById('quiz-options');
  const feedbackElement = document.getElementById('feedback');
  const finalScoreElement = document.getElementById('final-score');
  const submitButton = document.getElementById('submit-answer');

  function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsListElement.innerHTML = '';
    currentQuestion.options.forEach(option => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = option;
      button.addEventListener('click', () => selectAnswer(option));
      li.appendChild(button);
      optionsListElement.appendChild(li);
    });
  }

  function selectAnswer(selected) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    if (selected === correctAnswer) {
      score++;
      feedbackElement.textContent = 'Correct! Good job!';
    } else {
      feedbackElement.textContent = 'Oops! That’s not right.';
    }
    submitButton.hidden = false;
  }

  submitButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
      feedbackElement.textContent = '';
      submitButton.hidden = true;
    } else {
      quizContainer.hidden = true;
      finalScoreElement.textContent = `Your final score is: ${score}/${questions.length}`;
      finalScoreElement.hidden = false;
    }
  });

  displayQuestion();
});
