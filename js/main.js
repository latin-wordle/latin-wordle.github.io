document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");
    getNewWord();

    function getNewWord() {
        let filePath = "assets/words2.txt";
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                let lines = data.split("\r\n");
                let words = [];
                for (let i = 0; i < lines.length; i++) {
                    words.push(lines[i]);
                }
                // get a random word that is exactly 5 characters long
                let randomWord = words[Math.floor(Math.random() * words.length)];
                while (randomWord.length !== 5) {
                    randomWord = words[Math.floor(Math.random() * words.length)];
                }
                word = randomWord;
                console.log(word);
            });

        // read the full text file(cloelia.txt) and find the line which contains the word, set that word to the hint paragraph
        let filePath2 = "assets/cloelia2.txt";
        fetch(filePath2)
            .then(response => response.text())
            .then(data => {
                let lines = data.split('.');
                for (let i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].replaceAll("\r\n", " ");
                }
                console.log(lines);
                let hint = "";
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes(word)) {
                        hint = lines[i];
                        console.log(hint);
                        hint = hint.replace(word, "-".repeat(word.length));
                        hint = "Hint: " + hint;
                    }
                }
                if (hint.length === 0) {
                    hint = "No hints found in the text. You can refresh the page for a new word.";
                }
                document.querySelector("#hint").innerHTML = hint;
            });
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        });

        guessedWordCount += 1;
        console.log(currentWord);
        if (currentWord === word) {
            window.alert("Congratulations! You found the word! Refresh the page for a new word!");
        }

        if (guessedWords.length === 6) {
            window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        }

        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord();
                return;
            }

            if (letter === "del") {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }
});
