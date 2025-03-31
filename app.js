// State management
let currentStage = 'preJoke';
let currentQuestion = '';
let currentAnswer = '';

// DOM elements
const contentDiv = document.getElementById('content');
const actionBtn = document.getElementById('action-btn');

// Event listener for the action button
actionBtn.addEventListener('click', handleAction);

// Load JSON data
let questionsData = [];
let answersData = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => questionsData = data)
    .catch(error => console.error('Error loading questions:', error));

fetch('answers.json')
    .then(response => response.json())
    .then(data => answersData = data)
    .catch(error => console.error('Error loading answers:', error));

// Handle button clicks based on current stage
function handleAction() {
    switch(currentStage) {
        case 'preJoke':
            generateJoke();
            break;
        case 'joke':
            showAnswer();
            break;
        case 'answer':
            generateJoke();
            break;
    }
}

// Generate a new joke
function generateJoke() {
    if (questionsData.length === 0 || answersData.length === 0) {
        contentDiv.innerHTML = '<p>Loading data...</p>';
        return;
    }

    // Get random question parts
    const noun = getRandomItem(questionsData.nouns);
    const action = getRandomItem(questionsData.actions);
    
    // Get random answer parts
    const answerOpen = getRandomItem(answersData.answerOpens);
    let answerClose = '';
    if (Math.random() < 0.65) { // 65% chance to include answerClose
        answerClose = getRandomItem(answersData.answerCloses);
    }

    // Store current joke
    currentQuestion = `Why did the ${noun} ${action}?`;
    currentAnswer = `${answerOpen} ${answerClose}`.trim();

    // Display question
    contentDiv.innerHTML = `
        <p class="question">Question:</p>
        <p class="question">${currentQuestion}</p>
    `;
    
    // Update UI
    actionBtn.textContent = 'See answer';
    currentStage = 'joke';
}

// Show the answer
function showAnswer() {
    contentDiv.innerHTML = `
        <p class="question">Question:</p>
        <p class="question">${currentQuestion}</p>
        <p class="answer">Answer:</p>
        <p class="answer">${currentAnswer}</p>
    `;
    
    actionBtn.textContent = 'New AntiJoke';
    currentStage = 'answer';
}

// Helper function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}