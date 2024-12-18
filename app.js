const data = {
    children: [
        { question: "Who made you?", answer: "God." },
        { question: "What else did God make?", answer: "God made all things." },
        { question: "Why did God make you and all things?", answer: "For his own glory." },
        { question: "How can you glorify God?", answer: "By loving him and doing what he commands." },
        { question: "Why ought you to glorify God?", answer: "Because he made me and takes care of me." }
    ],
    puritan: [
        { question: "What is the chief end of man?", answer: "Man's chief end is to glorify God, and to enjoy him forever." },
        { question: "What rule has God given to direct us how we may glorify him?", answer: "The Word of God which is contained in the Scriptures of the Old and New Testaments is the only rule to direct us how we may glorify God and enjoy him." },
        { question: "What do the Scriptures principally teach?", answer: "The Scriptures principally teach what man is to believe concerning God, and what duty God requires of man." },
        { question: "What is God?", answer: "God is Spirit, infinite, eternal, and unchangeable in his being, wisdom, power, holiness, justice, goodness, and truth." },
        { question: "Are there more Gods than one?", answer: "There is but one only, the living and true God." }
    ]
};

const flashcard = document.querySelector('.flashcard');
const front = document.querySelector('.flashcard-front');
const back = document.querySelector('.flashcard-back');
const questionContent = document.getElementById('question-content');
const answerContent = document.getElementById('answer-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const multipleChoiceBtn = document.getElementById('multiple-choice-btn');
const firstLetterBtn = document.getElementById('first-letter-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');
const multipleChoiceContainer = document.getElementById('multiple-choice');
const firstLetterContainer = document.getElementById('first-letter');
const notification = document.getElementById('notification');

let currentCategory = 'children';
let currentIndex = 0;
let isTesting = false;

document.getElementById('category-select').addEventListener('change', () => {
    currentCategory = event.target.value;
    currentIndex = 0;
    resetCard();
    updateFlashcard();
});

flashcard.addEventListener('click', () => {
    if (!isTesting) flashcard.classList.toggle('flip');
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        resetCard();
        updateFlashcard();
    }
});

nextBtn.addEventListener('click', () => {
    const categoryData = data[currentCategory];
    if (currentIndex < categoryData.length - 1) {
        currentIndex++;
        resetCard();
        updateFlashcard();
    }
});

multipleChoiceBtn.addEventListener('click', () => {
    isTesting = true;
    generateMultipleChoice();
    toggleBackContent('multiple-choice');
});

firstLetterBtn.addEventListener('click', () => {
    isTesting = true;
    generateFirstLetter();
    toggleBackContent('first-letter');
});

showAnswerBtn.addEventListener('click', () => {
    resetCard();
    flashcard.classList.add('flip');
    toggleBackContent('answer');
    isTesting = false;
});

function updateFlashcard() {
    if (!data[currentCategory]) {
        console.error(`Invalid category: ${currentCategory}`);
        return;
    }

    const categoryData = data[currentCategory];
    if (currentIndex < 0 || currentIndex >= categoryData.length) {
        console.error(`Invalid index: ${currentIndex}`);
        return;
    }

    const currentCard = categoryData[currentIndex];
    front.textContent = `Q: ${currentCard.question}`;
    questionContent.textContent = `Q: ${currentCard.question}`;
    answerContent.textContent = `A: ${currentCard.answer}`;

    toggleBackContent('answer');

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === categoryData.length - 1;
}


function resetCard() {
    flashcard.classList.remove('flip');
}

function toggleBackContent(type) {
    multipleChoiceContainer.style.display = type === 'multiple-choice' ? 'grid' : 'none';
    firstLetterContainer.style.display = type === 'first-letter' ? 'block' : 'none';
    answerContent.style.display = type === 'answer' ? 'block' : 'none';
}

function generateMultipleChoice() {
    const categoryData = data[currentCategory];
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
            showNotification(isCorrect ? "Correct!" : "Incorrect!", isCorrect);

            if (isCorrect) {
                setTimeout(() => {
                    if (currentIndex < categoryData.length - 1) {
                        currentIndex++;
                        resetCard();
                        updateFlashcard();
                    }
                }, 1500);
            }
        });
        multipleChoiceContainer.appendChild(button);
    });
}

function generateFirstLetter() {
    const categoryData = data[currentCategory];
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
}


function revealWord(element, word) {
    element.textContent = word;
    element.classList.add('revealed');
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 1500);
}

updateFlashcard();
