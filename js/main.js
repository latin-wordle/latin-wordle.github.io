// document.addEventListener("DOMContentLoaded", () => {
document.getElementById('numberOfLetters-select').addEventListener('change', function () {
    console.log("v1.4");
    let numberOfLetters = 0;
    updateNumberOfLetters(this.value);

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");
    getNewWord();

    function updateNumberOfLetters(value) {
        numberOfLetters = value;
        document.querySelector(':root').style.setProperty('--numberOfSquares', numberOfLetters);
        createSquares();
        const div = document.getElementById('numberOfLetters')
        div.innerHTML = numberOfLetters.toString() + " Letter Wordle";
    }

    function getNewWord() {
        let filePath = "assets/all_words/divided_words/" + numberOfLetters + ".txt";
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                let lines = data.split("\n");
                let words = [];
                for (let i = 0; i < lines.length; i++) {
                    words.push(lines[i]);
                }
                let randomWord = words[Math.floor(Math.random() * words.length)];
                word = randomWord.toLowerCase();
                console.log(word);
            });

        // read the full text file(cloelia.txt) and find the line which contains the word, set that word to the hint paragraph
        /*let filePath2 = "assets/cloelia_words/cloelia2.txt";
        fetch(filePath2)
            .then(response => response.text())
            .then(data => {
                let lines = data.split('.');
                for (let i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].replaceAll("\r\n", " ");
                }
                // console.log(lines);
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
            });*/
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < numberOfLetters) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        // const isCorrectLetter = word.includes(letter);
        // const letterInThatPosition = word.charAt(index);
        // const isCorrectPosition = letter === letterInThatPosition;
        
        // if (isCorrectPosition) {
        //     return "rgb(83, 141, 78)"; // green
        // }

        // let alreadyCorrectLetter = false;

        // for (let i = 0; i < word.length; i++) {
        //     const letterInThatPosition = word.charAt(i);
        //     const isCorrectPosition = letter === letterInThatPosition;
        //     if (isCorrectPosition) {
        //         alreadyCorrectLetter = true;
        //     } else if (alreadyCorrectLetter) {
        //         return "rgb(58, 58, 60)"; 
        //     }
        // }

        // if (!isCorrectPosition && isCorrectLetter) {
        //     return "rgb(181, 159, 59)"; // yellow
        // } else {
        //     return "rgb(58, 58, 60)"; // grey
        // }
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
        if (parseInt(currentWordArr.length.toString()) !== parseInt(numberOfLetters.toString())) {
            window.alert("Word must be " + numberOfLetters.toString() + " letters");
            return;
        }
        const currentWord = currentWordArr.join("");
        const firstLetterId = guessedWordCount * numberOfLetters + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);
                var buttons = document.getElementsByTagName('button');
                for (let i = 0; i < buttons.length; i++) {
                    let button = buttons[i];
                    if (button.innerHTML === letter) {
                        button.style.backgroundColor = tileColor; 
                    }
                }
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        });

        guessedWordCount += 1;
        if (currentWord.toLowerCase() === word.toLowerCase()) {
            window.alert("Congratulations! You found the word! Refresh the page for a new word!");
            return;
        }

        if (guessedWords.length === 6) {
            window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
            return;
        }

        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < (6 * numberOfLetters); index++) {
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
