// State management
let currentStage = 'preJoke';
let currentQuestion = '';
let currentAnswer = '';

// DOM elements
const contentDiv = document.getElementById('content');
const actionBtn = document.getElementById('action-btn');

// Event listener for the action button
actionBtn.addEventListener('click', handleAction);

// Define all sets with their formats and paths
const sets = [
    {
        name: 'set1',
        questionFormat: 'Why did the {noun} {action}?',
        answerFormat: '{answerOpen} {answerClose}',
        questionPath: 'data/set1/questions.json',
        answerPath: 'data/set1/answers.json'
    },
    {
        name: 'set2',
        questionFormat: "What's the difference between {variable1} and {variable2}?",
        answerFormat: '{variable3}',
        questionPath: 'data/set2/questions.json',
        answerPath: 'data/set2/answers.json'
    },
    {
        name: 'set3',
        questionFormat: "What do you call a {variable1} {variable2}?",
        answerFormat: '{variable3} {variable4}',
        questionPath: 'data/set3/questions.json',
        answerPath: 'data/set3/answers.json'
    }
];

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
async function generateJoke() {
    try {
        // Randomly select a set
        const selectedSet = getRandomItem(sets);
        
        // Load the selected set's data
        const [questions, answers] = await Promise.all([
            fetchData(selectedSet.questionPath),
            fetchData(selectedSet.answerPath)
        ]);

        // Generate variables based on set
        let questionVars = {};
        let answerVars = {};
        
        if (selectedSet.name === 'set1') {
            questionVars = {
                noun: getRandomItem(questions.nouns),
                action: getRandomItem(questions.actions)
            };
            answerVars = {
                answerOpen: getRandomItem(answers.answerOpens),
                answerClose: Math.random() < 0.65 ? getRandomItem(answers.answerCloses) : ''
            };
        } 
        else if (selectedSet.name === 'set2') {
            questionVars = {
                variable1: getRandomItem(questions.variable1),
                variable2: getRandomItem(questions.variable2)
            };
            answerVars = {
                variable3: getRandomItem(answers.variable3)
            };
        } 
        else if (selectedSet.name === 'set3') {
            questionVars = {
                variable1: getRandomItem(questions.variable1),
                variable2: getRandomItem(questions.variable2)
            };
            answerVars = {
                variable3: getRandomItem(answers.variable3),
                variable4: Math.random() < 1? getRandomItem(answers.variable4) : ''
            };
        }

        // Format the question and answer
        currentQuestion = formatString(selectedSet.questionFormat, questionVars);
        currentAnswer = formatString(selectedSet.answerFormat, answerVars).trim();

        // Display question
        contentDiv.innerHTML = `
            <p class="question">Question:</p>
            <p class="question">${currentQuestion}</p>
        `;
        
        actionBtn.textContent = 'See answer';
        currentStage = 'joke';
    } catch (error) {
        console.error('Error generating joke:', error);
        contentDiv.innerHTML = '<p>Error loading joke. Please try again.</p>';
    }
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

// Helper function to fetch JSON data
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load data from ${url}`);
    }
    return await response.json();
}

// Helper function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function to format strings with variables
function formatString(template, variables) {
    return template.replace(/{(\w+)}/g, (_, key) => variables[key] || '');
}