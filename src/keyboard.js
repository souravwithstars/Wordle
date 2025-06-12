class Keyboard {
    #correctLetters;
    #wrongPositionLetters;
    #wrongLetters;
    constructor() {
        this.#correctLetters = new Set();
        this.#wrongPositionLetters = new Set();
        this.#wrongLetters = new Set();
    }

    getCorrectLetters() {
        return this.#correctLetters;
    }

    getWrongPositionLetters() {
        return this.#wrongPositionLetters;
    }

    getWrongLetters() {
        return this.#wrongLetters;
    }

    addAsCorrect(typedLetter) {
        this.#correctLetters.add(typedLetter);
    }

    addAsWrongPosition(typedLetter) {
        this.#wrongPositionLetters.add(typedLetter);
    }

    deleteFromWrongPosition(letter) {
        this.#wrongPositionLetters.delete(letter);
    }

    addAsWrong(typedLetter) {
        this.#wrongLetters.add(typedLetter);
    }

    validate(typed, correctSpots, wrongSpots) {
        for (const index of correctSpots) {
            const letter = typed[index];
            this.deleteFromWrongPosition(letter);
            this.addAsCorrect(letter);
        }
        for (const index of wrongSpots) {
            const letter = typed[index];
            if (!this.getCorrectLetters().has(letter)) this.addAsWrongPosition(letter);
        }
        for (const letter of typed) {
            if (!(this.getCorrectLetters().has(letter) || this.getWrongPositionLetters().has(letter))) {
                this.addAsWrong(letter);
            }
        }
    }
}