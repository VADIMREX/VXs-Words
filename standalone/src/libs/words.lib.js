/**
 * сохранить файл 
 * @param {string} filename
 * @param {string} text
 */
function saveFile(filename, text) {
  let oFile = document.createElement('a');
  oFile.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  oFile.setAttribute('download', filename);
  if (document.createEvent) {
    let event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    oFile.dispatchEvent(event);
  }
  else {
    oFile.click();
  }
}

/**
 * открыть файл
 * @param {(this:Scope, content: string )=>void} callback
 * @param {Scope} scope
 * @template Scope
 */
function openFile(callback, scope) {
  var iFile = document.createElement('input');
  iFile.type = 'file';
  iFile.onchange = e => {
    var reader = new FileReader();
    reader.readAsText(e.target.files[0], 'UTF-8');
    reader.onload = readerEvent => callback.call(scope || this, readerEvent.target.result);
  }
  if (document.createEvent) {
    let event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    iFile.dispatchEvent(event);
  }
  else {
    iFile.click();
  }
}

const CookieManager = new class {

  /**
   * @param {string} key
   * @return {string}
   */
  getRaw(key) {
    return document.cookie.replace(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`, "$1");
  }
  /**
   * @param {string} key
   * @param {T?} def
   * @return {T}
   * @template T
   */
  get(key, def) {
    if (arguments.length < 2) def = null;
    let s = this.getRaw(key);
    s = b64DecodeUnicode(s);
    return s ? JSON.parse(s) : def;
  }
  /**
   * @param {string} key
   * @param {string} value
   */
  setRaw(key, value) {
    document.cookie = `${key}=${value}`;
  }
  /**
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    value = null == value ? "" : JSON.stringify(value);
    value = b64EncodeUnicode(value);
    this.setRaw(key, value);
  }
}
const WordsManager = new class {
  constructor() {

  }
  getWordKey(word) {
    let res = {};
    for (let i = 0; i < word.length; i++)
      if (!res[word[i]]) res[word[i]] = 1;
      else res[word[i]]++;
    return res;
  }
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
  /** 
   * Найти случайное слово
   * @param {number?} minLength минимальная длинна слова, по умолчанию поиск по всем словам
   * @return {string} 
   */
  getRndWord(minLength) {
    if (undefined == minLength) minLength = 0;
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
}

const OnlineConnection = new class {
  constructor() {
    this.isConnected = false;
    /** @type {VXsEvent<[boolean]>} */
    this.onIsOnlineChanged = new VXsEvent();
  }
}

class Profile {
  static instance = new Profile();
  static loadProfileOnline() {

  }
  static saveProfileOnline() {

  }
  static loadProfileOffline() {
    openFile(content => {
      let model = JSON.parse(content);
      this.instance = new Profile(model)
    }, this);
  }
  static saveProfileOffline() {
    saveFile(i.name, JSON.stringify(this.instance));
  }

  constructor(model) {
    if (arguments.length < 1) model = {};
    ({
      name: this.name
    } = model);
  }
}