(function () {
  const generateRandomWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
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
    setTimeout(() => alert(`Oops! The Correct Word Is ${actualWord}`), 200);
    return;
  };

  const removeListeneners = board => {
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

  const declaredWinner = board => {
    removeListeneners(board);
    setTimeout(() => alert('You Guessed The Correct Word'), 200);
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
      declaredWinner(board);
      return;
    }
    if (allGuessWrong(board)) {
      showCorrectWord(board);
      return;
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
    return event => {
      board.removeChar();
      deleteChar(board);
    };
  };

  const handleclickForEnter = board => {
    return event => {
      validator(board);
    };
  };

  const handleKeyDown = board => {
    return event => {
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
    };
  };

  const main = async () => {
    const wordBlocks = ['word-1', 'word-2', 'word-3', 'word-4', 'word-5', 'word-6'];
    const wordsToGuess =  await generateRandomWord();

    const board = new Board(wordBlocks, wordsToGuess.toUpperCase());
    const letterSpans = document.getElementsByClassName('char');
    [...letterSpans].forEach(span => {
      span.onclick = handleClickForAdd(board);
    });

    const backspaceKey = document.getElementById('backspace');
    backspaceKey.onclick = handleClickForBackSpace(board);

    const enterKey = document.getElementById('enter');
    enterKey.onclick = handleclickForEnter(board);

    document.onkeydown = handleKeyDown(board);
  };

  window.onload = main;
})();
