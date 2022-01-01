import { splitOnSpecialChars } from '../libs/VXsStringUtils';

type VXsIDictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]: TValue;
};

type WordKey = VXsIDictionary<string, number>;

export interface WordInfo {
    /** слово */
    word: string,
    /** редкость */
    rarity: number,
    /** стоимость */
    price: number,
    /** найдено? (для результатов) */
    isFound: boolean,
}

const WordsManager = new (class WordsManager {
    words: VXsIDictionary<string, number>;
    mostCommon: number;
    longest: number;

    constructor() {
        this.words = {};
        this.mostCommon = 0;
        this.longest = 0;
    }
    getWordKey(word: string): WordKey {
        let res: WordKey = {};
        for (let i = 0; i < word.length; i++)
            if (!res[word[i]]) res[word[i]] = 1;
            else res[word[i]]++;
        return res;
    }
    checkTwoKeys(key1: WordKey, key2: WordKey) {
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
    importText(text: string) {
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
     * @param minLength минимальная длинна слова, по умолчанию поиск по всем словам
     * @return
     */
    getRndWord(minLength?: number) {
        let findedWords = Object.entries(this.words)
            .filter(x => x[0].length > (minLength || 0))
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
    checkRarity(word: string) {
        let rarity = this.words[word];
        return rarity > 0 ? (this.mostCommon - rarity) / this.mostCommon : 0;
    }
    /**
     * Проверить стоимость слова
     * @param {string} word
     * @return стоимость слова, учитывается длинна слова и редкость, самое
     * редкое слово стоит в 2 раза дороже самого обыного с той же длинной
     */
    checkPrice(word: string) {
        let price = this.words[word];
        if (price > 0) return word.length + this.checkRarity(word) * this.longest;
        return -1;
    }

    getWordsByLength() {
        let wordsByLength: WordInfo[][] = [];
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