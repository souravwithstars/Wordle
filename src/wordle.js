(function () {
  const displayChar = board => {
    const divName = board.getDivName();
    const index = board.getIndex();
    const divElement = document.getElementById(divName);
    if (index <= 4) {
      const span = divElement.children[index];
      span.innerText = board.getLastCharacterTyped();
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

  const colorGreenOnBoard = (index, board) => {
    const divName = board.getDivName();
    const div = document.getElementById(divName);
    const span = div.children[index];
    colorGreen(span);
    changeBoxStyle(span);
  };

  const colorYellowOnBoard = (index, board) => {
    const divName = board.getDivName();
    const div = document.getElementById(divName);
    const span = div.children[index];
    colorYellow(span);
    changeBoxStyle(span);
  };

  const colorGreyOnBoard = (correctSpots, wrongSpots, board) => {
    const divName = board.getDivName();
    const div = document.getElementById(divName);
    for (let index = 0; index < 5; index++) {
      if (!(correctSpots.includes(index) || wrongSpots.includes(index))) {
        const span = div.children[index];
        colorGrey(span);
        changeBoxStyle(span);
      }
    }
  };

  const colorGreenOnKeyboard = letterId => {
    const letterSpan = document.getElementById(letterId);
    colorGreen(letterSpan);
    changeBoxStyle(letterSpan);
  };

  const colorYellowOnKeyboard = letterId => {
    const letterSpan = document.getElementById(letterId);
    colorYellow(letterSpan);
    changeBoxStyle(letterSpan);
  };

  const colorGreyOnKeyboard = letterId => {
    const letterSpan = document.getElementById(letterId);
    colorGrey(letterSpan);
    changeBoxStyle(letterSpan);
  };

  const makeColorOnBoard = board => {
    const correctSpots = board.getCorrectSpots();
    const wrongSpots = board.getWrongSpots();

    correctSpots.forEach(spot => colorGreenOnBoard(spot, board));
    wrongSpots.forEach(spot => colorYellowOnBoard(spot, board));
    colorGreyOnBoard(correctSpots, wrongSpots, board);
  };

  const makeColorOnKeyboard = keyboard => {
    const correctLetters = keyboard.getCorrectLetters();
    const wrongPositionedLetters = keyboard.getWrongPositionLetters();
    const wrongLetters = keyboard.getWrongLetters();

    correctLetters.forEach((value, _) => colorGreenOnKeyboard(value));
    wrongPositionedLetters.forEach((value, _) => colorYellowOnKeyboard(value));
    wrongLetters.forEach((value, _) => colorGreyOnKeyboard(value));
  };

  const wrongLength = board => {
    const typedWord = board.getTypedWord();
    return typedWord.length !== WORD_LENGTH;
  };

  const unknownWord = async board => {
    const typedWord = board.getTypedWord().toLowerCase();
    const validWords = await loadFiveLetterWords();

    return ![...validWords].includes(typedWord);
  };

  const guessCorrect = board => {
    const correctSpots = board.getCorrectSpots();
    return correctSpots.length === WORD_LENGTH;
  };

  const allGuessWrong = board => {
    const guessedCount = board.getGuessedCount();
    return guessedCount >= MAX_GUESS;
  };

  const showCorrectWord = board => {
    const actualWord = board.getActual();
    setTimeout(() => alert(showCorrectWordMessage(actualWord)), 200);
  };

  const removeListeners = () => {
    const spans = document.getElementsByClassName(LETTERS);
    [...spans].forEach(span => {
      span.onclick = null;
    });

    const backspaceKey = document.getElementById(BACKSPACE);
    backspaceKey.onclick = null;

    const enterKey = document.getElementById(ENTER);
    enterKey.onclick = null;

    document.onkeydown = null;
  };

  const declaredWinner = () => {
    removeListeners();
    setTimeout(() => alert(WINNING_MESSAGE), 200);
  };

  const validator = async (board, keyboard) => {
    if (wrongLength(board)) {
      alert(FIVE_LETTERS_ALERT_MESSAGE);
      return;
    }

    const isUnknown = await unknownWord(board);
    if (isUnknown) {
      alert(NOT_A_WORD);
      return;
    }

    board.validate();
    keyboard.validate(board.getTypedWord(), board.getCorrectSpots(), board.getWrongSpots());

    makeColorOnBoard(board);
    makeColorOnKeyboard(keyboard);

    board.changeResources();

    if (guessCorrect(board)) {
      declaredWinner();
      return;
    }
    if (allGuessWrong(board)) {
      showCorrectWord(board);
    }
  };

  const handleClickForAdd = board => {
    return event => {
      const letter = event.target.innerText;
      board.addChar(letter);
      displayChar(board);
    };
  };

  const handleClickForBackSpace = board => {
    return () => {
      board.removeChar();
      deleteChar(board);
    };
  };

  const handleClickForEnter = (board, keyboard) => {
    return async () => {
      await validator(board, keyboard);
    };
  };

  const handleKeyDown = (board, keyboard) => {
    return async event => {
      const key = event.key.toUpperCase();
      if (key >= 'A' && key <= 'Z' && key.length === 1) {
        board.addChar(key);
        displayChar(board);
      }
      if (key.toLowerCase() === BACKSPACE) {
        board.removeChar();
        deleteChar(board);
      }
      if (key.toLowerCase() === ENTER) {
        await validator(board, keyboard);
      }
    };
  };

  window.onload = async () => {
    const wordToGuess = await generateRandomWord();

    const board = new Board(WORD_BLOCKS, wordToGuess.toUpperCase());
    const keyboard = new Keyboard();

    const letterSpans = document.getElementsByClassName(LETTERS);
    [...letterSpans].forEach(span => {
      span.onclick = handleClickForAdd(board);
    });

    const backspaceKey = document.getElementById(BACKSPACE);
    backspaceKey.onclick = handleClickForBackSpace(board);

    const enterKey = document.getElementById(ENTER);
    enterKey.onclick = handleClickForEnter(board, keyboard);

    document.onkeydown = handleKeyDown(board, keyboard);
  };
})();
