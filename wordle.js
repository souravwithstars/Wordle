(function () {
  class Board {
    #wordBlocks;
    #actual;
    #typedWords;
    #typed;
    #guessedCount;
    #index;
    #nextIndex;
    #correctSpots;
    #wrongSpots;
    constructor(wordBlocks, actual) {
      this.#wordBlocks = wordBlocks;
      this.#actual = actual;
      this.#typedWords = [];
      this.#typed = '';
      this.#guessedCount = 0;
      this.#index = 0;
      this.#nextIndex = 0;
      this.#correctSpots = [];
      this.#wrongSpots = [];
    }

    getDivName() {
      return this.#wordBlocks[this.#guessedCount];
    }

    getActual() {
      return this.#actual;
    }

    getIndex() {
      return this.#index;
    }

    getTypedWord() {
      return this.#typed;
    }

    getLastCharacterTyped() {
      const lastIndex = this.#typed.length - 1;
      return this.#typed[lastIndex];
    }

    getGuessedCount() {
      return this.#guessedCount;
    }

    getCorrectSpots() {
      return this.#correctSpots;
    }

    getWrongSpots() {
      return this.#wrongSpots;
    }

    addChar(character) {
      this.#index = this.#nextIndex;
      if (this.#index <= 4) {
        this.#typed += character;
        this.#nextIndex++;
        return;
      }
      this.#nextIndex = 5;
    }

    removeChar() {
      this.#nextIndex--;
      if (this.#nextIndex <= 0) {
        this.#index = 0;
        this.#nextIndex = 0;
        return;
      }
      if (this.#index < 0) {
        this.#index = 0;
        this.#nextIndex = 0;
        return;
      }
      this.#index = this.#nextIndex;
      this.#typed = this.#typed.slice(0, this.#typed.length - 1);
    }

    validate() {
      this.#correctSpots = checkCorrect(this.#actual, this.#typed);
      this.#wrongSpots = checkWrong(
        this.#actual, this.#typed, this.#correctSpots
      );
    }

    changeResources() {
      this.#typedWords.push(this.getTypedWord);
      this.#typed = '';
      this.#guessedCount += 1;
      this.#nextIndex = 0;
    }
  }

  const displayChar = board => {
    const divName = board.getDivName();
    const index = board.getIndex();
    const divElement = document.getElementById(divName);
    if (index <= 4) {
      const span = divElement.children[index];
      const lastCharacterTyped = board.getLastCharacterTyped();
      span.innerText = lastCharacterTyped;
    }
  };

  const deleteChar = board => {
    const divName = board.getDivName();
    let index = board.getIndex();
    if (index > 4) {
      index = 4;
    }
    const divElement = document.getElementById(divName);
    const span = divElement.children[index];
    span.innerText = '';
  };

  const changeBoxStyle = span => {
    span.style.color = 'white';
    span.style['border-color'] = 'white';
  };

  const colorGreen = (index, board) => {
    const divName = board.getDivName();
    const div = document.getElementById(divName);
    const span = div.children[index];
    span.style['background-color'] = 'rgb(106, 170, 99, 1)';
    changeBoxStyle(span);
  };

  const colorYellow = (index, board) => {
    const divName = board.getDivName();
    const div = document.getElementById(divName);
    const span = div.children[index];
    span.style['background-color'] = 'rgb(202, 180, 88, 1)';
    changeBoxStyle(span);
  };

  const colorGrey = (correctSpots, wrongSpots, board) => {
    const divName = board.getDivName();
    const div = document.getElementById(divName);
    for (let i = 0; i < 5; i++) {
      if (!(correctSpots.includes(i) || wrongSpots.includes(i))) {
        const span = div.children[i];
        span.style['background-color'] = 'rgb(120, 124, 126, 1)';
        changeBoxStyle(span);
      }
    }
  };

  const makeColor = board => {
    const correctSpots = board.getCorrectSpots();
    const wrongSpots = board.getWrongSpots();


    correctSpots.forEach(spot => colorGreen(spot, board));
    wrongSpots.forEach(spot => colorYellow(spot, board));
    colorGrey(correctSpots, wrongSpots, board);
  };

  const checkCorrect = (actual, typed) => {
    const correctChars = typed.split('').filter((char, index) => char === actual[index]);

    const correctSpots = correctChars.map(char => actual.indexOf(char));
    return correctSpots;
  };

  const checkWrong = (actual, typed, correctSpots) => {
    const wrongSpots = [];
    const actualWord = actual.split('');
    for (let i = 0; i < typed.length; i++) {
      if (!correctSpots.includes(i)) {
        for (j = 0; j < typed.length; j++) {
          if (typed[j] === actual[i]) {
            wrongSpots.push(i);
          }
        }
      }
    }
    return wrongSpots;
  };

  const wrongLength = board => {
    const typedWord = board.getTypedWord();
    return typedWord.length !== 5;
  };

  const guessCorrect = board => {
    const correctSpots = board.getCorrectSpots();
    return correctSpots.length === 5;
  };

  const allGuessWrong = board => {
    const guessedCount = board.getGuessedCount();
    return guessedCount >= 6;
  };

  const showCorrectWord = board => {
    const actualWord = board.getActual();
    setTimeout(() => alert(`Oops! The Correct Word Is ${actualWord}`), 1000);
    return;
  };

  const validator = board => {
    if (wrongLength(board)) {
      alert('Please Insert 5 Letters Word');
      return;
    }
    board.validate();
    makeColor(board);
    board.changeResources();
    if (guessCorrect(board)) {
      setTimeout(() => alert('You Guessed The Correct Word'), 1000);
      return;
    }
    if (allGuessWrong(board)) {
      showCorrectWord(board);
      return;
    }
  };

  const main = () => {
    const wordBlocks = ['word-1', 'word-2', 'word-3', 'word-4', 'word-5', 'word-6'];
    const actual = 'ROMAN';
    const board = new Board(wordBlocks, actual);
    const letterSpans = document.getElementsByClassName('char');

    [...letterSpans].forEach(span => {
      span.addEventListener('click', event => {
        const letter = event.target.innerText;
        board.addChar(letter);
        displayChar(board);
      });
    });

    const backspaceKey = document.getElementById('backspace');
    backspaceKey.addEventListener('click', event => {
      board.removeChar();
      deleteChar(board);
    });

    const enterKey = document.getElementById('enter');
    enterKey.addEventListener('click', event => {
      validator(board);
    });

    document.addEventListener('keydown', (event) => {
      const key = event.key.toUpperCase();
      if (key >= 'A' && key <= 'Z' && key.length === 1) {
        board.addChar(key);
        displayChar(board);
      }
      if (key === 'BACKSPACE') {
        board.removeChar();
        deleteChar(board);
      }
      if (key === 'ENTER') {
        validator(board);
      }
    });
  };

  window.onload = main;
})();
