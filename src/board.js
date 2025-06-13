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
    return this.#wordBlocks[this.getGuessedCount()];
  }

  getActual() {
    return this.#actual;
  }

  getIndex() {
    return this.#index;
  }

  setIndex(index) {
    this.#index = index;
  }

  getNextIndex() {
    return this.#nextIndex;
  }

  setNextIndex(index) {
    this.#nextIndex = index;
  }

  getTypedWord() {
    return this.#typed;
  }

  setTypedWord(word) {
    this.#typed = word;
  }

  getLastCharacterTyped() {
    const lastIndex = this.getTypedWord().length - 1;
    return this.#typed[lastIndex];
  }

  getGuessedCount() {
    return this.#guessedCount;
  }

  setGuessedCount(count) {
    this.#guessedCount = count;
  }

  getCorrectSpots() {
    return this.#correctSpots;
  }

  setCorrectSpots(spots) {
    this.#correctSpots = spots;
  }

  getWrongSpots() {
    return this.#wrongSpots;
  }

  setWrongSpots(spots) {
    this.#wrongSpots = spots;
  }

  addChar(character) {
    this.setIndex(this.getNextIndex())
    if (this.getIndex() <= 4) {
      this.setTypedWord(this.getTypedWord() + character);
      this.setNextIndex(this.getNextIndex() + 1);
      return;
    }
    this.setNextIndex(5);
  }

  removeChar() {
    this.setNextIndex(this.getNextIndex() - 1);
    if (this.getNextIndex() < 0) {
      this.setIndex(0);
      this.setNextIndex(0);
      return;
    }
    if (this.getIndex() < 0) {
      this.setIndex(0);
      this.setNextIndex(0);
      return;
    }
    this.setIndex(this.getNextIndex());

    const lastIndex = this.getTypedWord().length - 1;
    this.setTypedWord(this.getTypedWord().slice(0, lastIndex));
  }

  validate() {
    this.setCorrectSpots(
        checkCorrect(
            this.getActual(),
            this.getTypedWord()
        )
    );
    this.setWrongSpots(
        checkWrong(
            this.getActual(),
            this.getTypedWord(),
            this.getCorrectSpots()
        )
    );
  }

  changeResources() {
    this.#typedWords.push(this.getTypedWord());
    this.setTypedWord('');
    this.setGuessedCount(this.getGuessedCount() + 1);
    this.setNextIndex(0);
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
