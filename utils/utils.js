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

const showCorrectWordMessage = word => `Oops! The Correct Word Is ${word}`;

const changeBoxStyle = element => {
    element.style.color = WHITE;
    element.style[BORDER_COLOR] = WHITE;
};

const colorGreen = element => {
    element.style[BACKGROUND_COLOR] = GREEN;
};

const colorYellow = element => {
    element.style[BACKGROUND_COLOR] = YELLOW;
};

const colorGrey = element => {
    element.style[BACKGROUND_COLOR] = GREY;
};