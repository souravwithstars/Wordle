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
    if (this.#nextIndex < 0) {
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

const checkCorrect = (actual, typed) => {
  const checkingArray = actual.split('');
  const correctChars = typed.split('').filter((char, index) => char === actual[index]);

  return correctChars.map(char => {
    const index = checkingArray.indexOf(char);
    checkingArray[index] = null;
    return index;
  });
};

const checkWrong = (actual, typed, correctSpots) => {
  const wrongSpots = [];
  const wrongLetters = new Set();
  const actualWord = actual.split('');
  for (let i = 0; i < typed.length; i++) {
    if (!correctSpots.includes(i)) {
      for (let j = 0; j < typed.length; j++) {
        if (typed[j] === actualWord[i] && !wrongLetters.has(actualWord[i])) {
          wrongLetters.add(actualWord[i]);
          wrongSpots.push(j);
        }
      }
    }
  }
  return wrongSpots;
};
