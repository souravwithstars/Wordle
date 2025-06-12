(function () {
  const loadFiveLetterWords = async () => {
    const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt');
    const text = await response.text();
    const words = text.split('\n')
        .map(word => word.trim().toLowerCase())
        .filter(word => word.length === 5 && /^[a-z]+$/.test(word));

    return new Set(words);
  };

  const generateRandomWord = async () => {
    try {
      const response = await fetch('https://random-word-api.vercel.app/api?words=1&length=5');
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error fetching word:', error);
      return null;
    }
  };

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

  const colorGreenOnKeyboard = letterId => {
    const letterSpan = document.getElementById(letterId);
    letterSpan.style['background-color'] = 'rgb(106, 170, 99, 1)';
    changeBoxStyle(letterSpan);
  };

  const colorYellowOnKeyboard = letterId => {
    const letterSpan = document.getElementById(letterId);
    letterSpan.style['background-color'] = 'rgb(202, 180, 88, 1)';
    changeBoxStyle(letterSpan);
  };

  const colorGreyOnKeyboard = letterId => {
    const letterSpan = document.getElementById(letterId);
    letterSpan.style['background-color'] = 'rgb(120, 124, 126, 1)';
    changeBoxStyle(letterSpan);
  };


  const makeColorOnBoard = board => {
    const correctSpots = board.getCorrectSpots();
    const wrongSpots = board.getWrongSpots();

    correctSpots.forEach(spot => colorGreen(spot, board));
    wrongSpots.forEach(spot => colorYellow(spot, board));
    colorGrey(correctSpots, wrongSpots, board);
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
    return typedWord.length !== 5;
  };

  const unknownWord = async board => {
    const typedWord = board.getTypedWord().toLowerCase();
    const validWords = await loadFiveLetterWords();

    return ![...validWords].includes(typedWord);
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
    setTimeout(() => alert(`Oops! The Correct Word Is ${actualWord}`), 200);
  };

  const removeListeners = () => {
    const spans = document.getElementsByClassName('char');
    [...spans].forEach(span => {
      span.onclick = null;
    });

    const backspaceKey = document.getElementById('backspace');
    backspaceKey.onclick = null;

    const enterKey = document.getElementById('enter');
    enterKey.onclick = null;

    document.onkeydown = null;
  };

  const declaredWinner = () => {
    removeListeners();
    setTimeout(() => alert('You Guessed The Correct Word'), 200);
  };

  const validator = async (board, keyboard) => {
    if (wrongLength(board)) {
      alert('Please Insert 5 Letters Word');
      return;
    }

    const isUnknown = await unknownWord(board);
    if (isUnknown) {
      alert('Not a Word');
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
      if (key === 'BACKSPACE') {
        board.removeChar();
        deleteChar(board);
      }
      if (key === 'ENTER') {
        await validator(board, keyboard);
      }
    };
  };

  window.onload = async () => {
    const wordBlocks = ['word-1', 'word-2', 'word-3', 'word-4', 'word-5', 'word-6'];
    const wordsToGuess = await generateRandomWord();

    const board = new Board(wordBlocks, wordsToGuess.toUpperCase());
    const keyboard = new Keyboard();
    const letterSpans = document.getElementsByClassName('char');
    [...letterSpans].forEach(span => {
      span.onclick = handleClickForAdd(board);
    });

    const backspaceKey = document.getElementById('backspace');
    backspaceKey.onclick = handleClickForBackSpace(board);

    const enterKey = document.getElementById('enter');
    enterKey.onclick = handleClickForEnter(board, keyboard);

    document.onkeydown = handleKeyDown(board, keyboard);
  };
})();
