import { splitOnSpecialChars } from '../libs/VXsStringUtils';

/**
 * @typedef {{[key: string]: number}} WordKey
 */
const WordsManager = new (class WordsManager {
    constructor() {
        this.words = {};
    }
    /** 
     * @param {srting} word 
     * @returns {WordKey} 
     */
    getWordKey(word) {
        let res = {};
        for (let i = 0; i < word.length; i++)
            if (!res[word[i]]) res[word[i]] = 1;
            else res[word[i]]++;
        return res;
    }
    /**
     * 
     * @param {WordKey} key1 
     * @param {WordKey} key2 
     * @returns {boolean}
     */
    checkTwoKeys(key1, key2) {
        for (let i in key1)
            if ((key2[i] || 0) < key1[i]) return false;
        return true;
    }

    /** найти самое часто встречающееся слово */
    getMostCommon() {
        /** @type {number} */
        this.mostCommon = 0;
        Object.entries(this.words).forEach(w => this.mostCommon = this.mostCommon > w[1] ? this.mostCommon : w[1]);
        return this.mostCommon;
    }
    /** найти наидлиннейшее слово */
    getLongest() {
        /** @type {number} */
        this.longest = 0;
        Object.entries(this.words).forEach(w => this.longest = this.longest > w[0].length ? this.longest : w[0].length);
        return this.longest;
    }
    /** 
     * Импорт текста
     * @param {string} text текст
     */
    importText(text) {
        this.words = {};
        let wordArr = splitOnSpecialChars(text);
        for (let i = 0; i < wordArr.length; i++) {
            let word = wordArr[i].toUpperCase()
            if (!this.words[word]) this.words[word] = 1;
            else this.words[word]++;
        }
        this.getMostCommon();
        this.getLongest();
    }
    getText() {
        return Object.entries(this.words)
                     .map(x=>x[0]);
    }
    /** 
     * Найти случайное слово
     * @param {number} [minLength] минимальная длинна слова, по умолчанию поиск по всем словам
     * @return {string} 
     */
    getRndWord(minLength) {
        if (undefined === minLength) minLength = 0;
        let findedWords = Object.entries(this.words)
            .filter(x => x[0].length > minLength)
            .map(x => x[0]);
        return findedWords[Math.floor(Math.random() * findedWords.length)]
    }
    /**
     * Проверить редкость слова
     * @param {string} word слово
     * @return от 0 до 1 на сколько слово редкое:
     * - 1 самое редкое
     * - 0 самое обычное или не найденное
     */
    checkRarity(word) {
        let rarity = this.words[word];
        return rarity > 0 ? (this.mostCommon - rarity) / this.mostCommon : 0;
    }
    /**
     * Проверить стоимость слова
     * @param {string} word
     * @return стоимость слова, учитывается длинна слова и редкость, самое
     * редкое слово стоит в 2 раза дороже самого обыного с той же длинной
     */
    checkPrice(word) {
        let price = this.words[word];
        if (price > 0) return word.length + this.checkRarity(word) * this.longest;
        return -1;
    }

    /**
     * 
     * @returns {WordInfo[][]}
     */
    getWordsByLength() {
        let wordsByLength = [];
        for (let word in this.words) {
            if (!wordsByLength[word.length]) wordsByLength[word.length] = [];
            wordsByLength[word.length].push({
                word: word,
                price: Math.round(this.checkPrice(word) * 100) / 100,
                rarity: Math.round(this.checkRarity(word) * 100),
                isFound: false
            });
        }
        return wordsByLength;
    }
})();

export default WordsManager;