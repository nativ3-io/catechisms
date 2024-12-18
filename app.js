import { childrenCatechism } from './childrenCatechism.js';
import { puritanCatechism } from './puritanCatechism.js';
import { children2Catechism } from './children2Catechism.js';

const catechismFiles = {
    children: childrenCatechism,
    puritan: puritanCatechism,
    children2: children2Catechism,
};

const flashcard = document.querySelector('.flashcard');
const front = document.querySelector('.flashcard-front');
const answerContent = document.getElementById('answer-content');
const questionContent = document.getElementById('question-content');
const multipleChoiceContainer = document.getElementById('multiple-choice');
const firstLetterContainer = document.getElementById('first-letter');
const jeopardyContainer = document.getElementById('jeopardy-mode');
const categorySelect = document.getElementById('category-select');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const multipleChoiceBtn = document.getElementById('multiple-choice-btn');
const firstLetterBtn = document.getElementById('first-letter-btn');
const jeopardyBtn = document.getElementById('jeopardy-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');
const notification = document.getElementById('notification');

let currentCategory = 'children';
let currentIndex = 0;

function populateDropdown() {
    categorySelect.innerHTML = '';
    Object.keys(catechismFiles).forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
}

function updateFlashcard() {
    const categoryData = catechismFiles[currentCategory];
    const currentCard = categoryData[currentIndex];
    front.textContent = `Q: ${currentCard.question}`;
    answerContent.textContent = `A: ${currentCard.answer}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === categoryData.length - 1;
}

function toggleBackContent(type) {
    multipleChoiceContainer.style.display = 'none';
    firstLetterContainer.style.display = 'none';
    jeopardyContainer.style.display = 'none';
    answerContent.style.display = 'none';

    if (type === 'multiple-choice') multipleChoiceContainer.style.display = 'grid';
    if (type === 'first-letter') firstLetterContainer.style.display = 'block';
    if (type === 'jeopardy-mode') jeopardyContainer.style.display = 'grid';
    if (type === 'answer') answerContent.style.display = 'block';
}

function generateMultipleChoice() {
    const categoryData = catechismFiles[currentCategory];
    const currentCard = categoryData[currentIndex];

    const answers = [currentCard.answer];
    while (answers.length < 4) {
        const randomIndex = Math.floor(Math.random() * categoryData.length);
        const randomAnswer = categoryData[randomIndex].answer;
        if (!answers.includes(randomAnswer)) {
            answers.push(randomAnswer);
        }
    }

    answers.sort(() => Math.random() - 0.5);

    multipleChoiceContainer.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => {
            const isCorrect = answer === currentCard.answer;
            showNotification(isCorrect ? 'Correct!' : 'Incorrect!');
            if (isCorrect) {
                setTimeout(() => {
                    if (currentIndex < categoryData.length - 1) {
                        currentIndex++;
                        updateFlashcard();
                    }
                }, 1500);
            }
        });
        multipleChoiceContainer.appendChild(button);
    });

    flashcard.classList.add('flip');
    toggleBackContent('multiple-choice');
}

function generateFirstLetter() {
    const categoryData = catechismFiles[currentCategory];
    const currentCard = categoryData[currentIndex];

    const words = currentCard.answer.split(' ');
    firstLetterContainer.innerHTML = '';

    words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = `${word[0]}${'_'.repeat(word.length - 1)}`;
        span.addEventListener('click', () => {
            span.textContent = word;
            span.classList.add('revealed');
        });
        firstLetterContainer.appendChild(span);
        firstLetterContainer.appendChild(document.createTextNode(' '));
    });

    flashcard.classList.add('flip');
    toggleBackContent('first-letter');
}

function generateJeopardyMode() {
    const categoryData = catechismFiles[currentCategory];
    const currentCard = categoryData[currentIndex];

    answerContent.textContent = `A: ${currentCard.answer}`;
    questionContent.style.display = 'none';

    jeopardyContainer.innerHTML = '';
    const questions = [currentCard.question];
    while (questions.length < 4) {
        const randomIndex = Math.floor(Math.random() * categoryData.length);
        const randomQuestion = categoryData[randomIndex].question;
        if (!questions.includes(randomQuestion)) {
            questions.push(randomQuestion);
        }
    }

    questions.sort(() => Math.random() - 0.5);
    questions.forEach((question) => {
        const button = document.createElement('button');
        button.textContent = question;
        button.addEventListener('click', () => {
            const isCorrect = question === currentCard.question;
            showNotification(isCorrect ? 'Correct!' : 'Incorrect!');
        });
        jeopardyContainer.appendChild(button);
    });

    flashcard.classList.add('flip');
    toggleBackContent('jeopardy-mode');
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    populateDropdown();
    updateFlashcard();

    categorySelect.addEventListener('change', () => {
        currentCategory = categorySelect.value;
        currentIndex = 0;
        updateFlashcard();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateFlashcard();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < catechismFiles[currentCategory].length - 1) {
            currentIndex++;
            updateFlashcard();
        }
    });

    multipleChoiceBtn.addEventListener('click', () => {
        generateMultipleChoice();
    });

    firstLetterBtn.addEventListener('click', () => {
        generateFirstLetter();
    });

    jeopardyBtn.addEventListener('click', () => {
        generateJeopardyMode();
    });

    showAnswerBtn.addEventListener('click', () => {
        flashcard.classList.add('flip');
        toggleBackContent('answer');
    });
});