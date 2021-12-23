const {
  useState,
  useEffect,
  useRef
} = /** @type {{useState:<T>(arg:T)=>[T, (arg:T)=>void],useEffect: (mount:()=>()=>void)=>void}} */ (window.React);

/**
 * @typedef WordInfo информация о слове
 * @prop {string} word слово
 * @prop {number} rarity редкость
 * @prop {number} price стоимость
 * @prop {boolean} isFound найдено? (для результатов)
 */

/**
 * Таблица слов разбитая по колонкам
 * @param {{wordsByLength:WordInfo[][]}} props
 */
function WordsTable(props) {
  const { wordsByLength } = props;
  let res = [];
  let i = 0;
  let b;
  let header = [];
  for (let k = wordsByLength.length - 1; k > -1; k--)
    if (!wordsByLength[k] || 0 == wordsByLength[k].length) continue;
    else header.push((<th colspan={3}>{k}</th>));
  res.push((<tr>{header}</tr>))
  do {
    let row = [];
    b = false;
    for (let k = wordsByLength.length - 1; k > -1; k--) {
      if (!wordsByLength[k] || 0 == wordsByLength[k].length) continue;
      if (!wordsByLength[k] || !wordsByLength[k][i]) {
        row.push((<td colspan={3}></td>))
        continue;
      }
      b = true;
      let cell = wordsByLength[k][i].word
      if (wordsByLength[k][i].isFound) cell = (<b>{cell}</b>);
      row.push((<td>{cell}</td>),
        (<td>{wordsByLength[k][i].price}</td>),
        (<td>{wordsByLength[k][i].rarity}</td>));
    }
    if (b) res.push((<tr>{row}</tr>));
    i++;
  } while (b);
  return (
    <table>
      {res}
    </table>
  );
}

/**
 * Атрибуты основного меню 
 * @typedef MainMenuProps
 * @prop {undefined|()=>void} onNewGameClick - обаботчик кнопки новая игра
 * @prop {undefined|()=>void} onBackClick - обаботчик кнопки назад
 */

/** 
 * Основное меню 
 * @param {MainMenuProps} props
 */
function MainMenu(props) {
  let [menuState, setMenuState] = useState("main");

  function onNewGameClick() {
    if (!props || !props.onNewGameClick) return;
    props.onNewGameClick();
  }

  function onBackClick() {
    if (!props || !props.onBackClick) return;
    props.onBackClick();
  }

  function onBackToDefault() {
    setMenuState("mainMenu")
  }

  /** базовое состояние меню */
  function DefaultMenu() {
    return (
      <div class="menuContainer">
        <button class="menuButton" onClick={onNewGameClick}>Новая игра</button> <br />
        <button class="menuButton" onClick={() => setMenuState("dict")}>Посмотреть словарь</button> <br />
        <button class="menuButton" onClick={() => setMenuState("opts")}>Настройки</button> <br />
        <button class="menuButton" onClick={() => setMenuState("impexp")}>Импорт/Экспорт словаря</button><br />
        {
          props && props.onBackClick ?
            (<button class="menuButton" onClick={onBackClick}>Назад</button>) :
            (<br />)
        }
      </div>
    )
  }

  /** Просмотр словаря */
  function WordsDictionary() {
    /** @type {WordInfo[][]} */
    let wordsByLength = []
    for (let word in WordsManager.words) {
      if (!wordsByLength[word.length]) wordsByLength[word.length] = [];
      wordsByLength[word.length].push({
        word: word,
        price: Math.round(WordsManager.checkPrice(word) * 100) / 100,
        rarity: Math.round(WordsManager.checkRarity(word) * 100),
        isFound: false
      });
    }

    return (
      <div class="menuContainer">
        <WordsTable wordsByLength={wordsByLength} />
      </div>
    );
  }

  /** Настройки */
  function Options() {
    const { name } = Profile.instance;
    function onLoadContentOfflineClick() {
      Profile.loadProfileOffline();
    }
    function onSaveContentOfflineClick() {
      Profile.saveProfileOffline();
    }
    function SaveLoadOnline() {
      const [isConnected, setIsConnected] = useState(OnlineConnection.isConnected);
      useEffect(() => {
        OnlineConnection.onIsOnlineChanged.subscribe(setIsConnected);
        return () => OnlineConnection.onIsOnlineChanged.unsubscribe(setIsConnected);
      });
      if (!isConnected) return null;
      return (<div>
        Онлайн<br />
        <button class="menuButton" onClick={onSaveContentOfflineClick}>Сохранить профиль</button>
        <button class="menuButton" onClick={onLoadContentOfflineClick}>Загрузить профиль</button>
      </div>);
    }
    function SaveLoadOffline() {
      return (<div>
        Локально<br />
        <button class="menuButton" onClick={onSaveContentOfflineClick}>Сохранить профиль</button>
        <button class="menuButton" onClick={onLoadContentOfflineClick}>Загрузить профиль</button>
      </div>);
    }
    return (
      <div class="menuContainer">
        <button class="menuButton" onClick={onBackToDefault}>Назад</button><br />
        <SaveLoadOnline />
        <SaveLoadOffline />
      </div>

    );
  }

  function Importer() {
    const [text, setText] = useState("");

    function onSaveClick(event) {
      event.preventDefault();
      WordsManager.importText(text);
      onBackToDefault();
    }

    function onTextChange(event) {
      setText(event.target.value)
    }

    return (
      <form class="menuContainer" onSubmit={onSaveClick}>
        <input type="file" /><br />
        <textarea onChange={onTextChange}>{text}</textarea><br />
        <input class="menuButton" type="submit" value="Сохранить" />
      </form>
    );
  }

  switch (menuState) {
    case "main":
    default: return (<DefaultMenu />);
    case "opts":
      return (<Options />)
    case "dict":
      return (<WordsDictionary />)
    case "impexp":
      return (<Importer />)
  }
}

function Game(props) {
  const [state, setState] = useState("prepare");
  const [word, setWord] = useState("");
  /** 
   * @typedef resultsModel
   * @prop {number} score
   * @prop {string[]} findedWords
   * @prop {string} word
   */
  const [results, setResults] = useState(/** @type {resultsModel} */(null));

  function onBackClick() {
    if (!props || !props.onBackClick) return;
    props.onBackClick();
  }

  function selectWord(word) {
    setWord(word);
    setState("inGame");
  }

  /** 
   * @param {resultsModel} results 
   */
  function onGameOver(results) {
    setState("over");
    setResults(results);
  }

  function NewGame(props) {
    function getRandomWords() {
      return [
        WordsManager.getRndWord(),
        WordsManager.getRndWord(),
        WordsManager.getRndWord(),
        WordsManager.getRndWord()
      ];
    }

    const [rndWord, setRndWord] = useState(getRandomWords());
    const [searchWord, setSearchWord] = useState("");
    const [findedWords, setFindedWords] = useState(/** @type {string[]} */([]));

    function onRefreshRandom() {
      setRndWord(getRandomWords());
    }

    function onSearchWordChanged(event) {
      setSearchWord(event.target.value);
    }

    return (
      <div class="menuContainer">
        {props.children}
        <button class="menuButton" onClick={onBackClick}>в главное меню</button><br />
        Случайные слова <button onClick={onRefreshRandom}>🗘</button><br />
        <table>
          <tr>
            <td><button class="menuButton" onClick={() => selectWord(rndWord[0])}>{rndWord[0]}</button></td>
            <td><button class="menuButton" onClick={() => selectWord(rndWord[1])}>{rndWord[1]}</button></td>
          </tr>
          <tr>
            <td><button class="menuButton" onClick={() => selectWord(rndWord[2])}>{rndWord[2]}</button></td>
            <td><button class="menuButton" onClick={() => selectWord(rndWord[3])}>{rndWord[3]}</button></td>
          </tr>
        </table>
        <input type="text" value={searchWord} onChange={onSearchWordChanged} />
        <div>
          {findedWords.map((item) => (<button class="menuButton" onClick={() => selectWord(item)}>{item}</button>))}
        </div>
      </div>
    );
  }

  function InGame(props) {
    const [score, setScore] = useState(0);
    const [dScore, setDScore] = useState(0);
    /** 
     * @typedef letterModel 
     * @prop {string} char
     * @prop {boolean} isUsed
     */
    const [letters, setLetters] = useState(/** @type {letterModel[]} */(
      Array.from(word)
        .map(ch => {
          return {
            char: ch,
            isUsed: false
          }
        })
    ));
    /**
     * @typedef newLetterModel
     * @prop {string} char
     * @prop {number} fromLetter
     */
    const [newWord, setNewWord] = useState(/** @type {newLetterModel[]} */([]));
    const [findedWords, setFindedWords] = useState(/** @type {string[]} */([]));
    const [alreadyFinded, setAlreadyFinded] = useState("");
    const [lastFinded, setLastFinded] = useState("");

    /** @param {{
     *    char:string,
     *    enabled:boolean,
     *    position:number,
     *    onClick:(position:number)=>void
     * }} props */
    function Letter(props) {
      if (undefined === props.enabled) props.enabled = true;
      function onClick() {
        if (props.onClick) props.onClick(props.position);
      }
      return (
        <button onClick={onClick} disabled={!props.enabled}>{props.char}</button>
      )
    }

    /** 
     * @param {number} position 
     */
    function setLetterUsed(position, isUsed) {
      /** @type {letterModel[]} */
      let dLetters = [].concat(letters);
      dLetters[position].isUsed = isUsed;
      setLetters(dLetters);
    }
    /** 
     * @param {number} position 
     */
    function onLetterClick(position) {
      setLetterUsed(position, true);
      /** @type {newLetterModel[]} */
      let dNewWord = [].concat(newWord);
      let i = 0
      for (; i < dNewWord.length; i++)
        if (" " == dNewWord[i].char) break;
      dNewWord[i] = {
        char: letters[position].char,
        fromLetter: position
      }
      setNewWord(dNewWord);
    }

    /** 
     * @param {number} position 
     */
    function onNewLetterClick(position) {
      /** @type {newLetterModel[]} */
      let dNewWord = [].concat(newWord);
      setLetterUsed(dNewWord[position].fromLetter, false);
      dNewWord[position] = {
        char: " ",
        fromLetter: -1
      }
      setNewWord(dNewWord);
    }

    function changeScore(price) {
      setScore(score + price);
      setDScore(price);
    }

    /** Оценить слово */
    function onCheckWord() {
      let sWord = newWord.map(x => " " == x.char ? "" : x.char).join("");
      setLastFinded(sWord);
      setNewWord([]);
      /** @type {letterModel[]} */
      let dLetters = [].concat(letters);
      for (let i in dLetters) dLetters[i].isUsed = false;
      setLetters(dLetters);
      let letterPrice = WordsManager.checkPrice(sWord);
      if (-1 == letterPrice) return changeScore(letterPrice);
      let isAlreadyFinded = findedWords.find(x => x === sWord);
      if (isAlreadyFinded) setAlreadyFinded(isAlreadyFinded);
      else setFindedWords([sWord].concat(findedWords));
      changeScore(isAlreadyFinded ? 0 : letterPrice);
    }

    return (
      <div class="menuContainer">
        <button class="menuButton" onClick={onGameOver.bind(null, { score, findedWords, word })}>Завершить</button><br />
        <h2>{word}</h2>
        Очки: {Math.round(score * 100) / 100} {0 == score ? "" : (<span class={dScore > 0 ? "positive" : "negative"}>{dScore > 0 ? "+" : ""}{Math.round(dScore * 100) / 100}</span>)}<br />
        {newWord.map((l, i) => (<Letter char={l.char} position={i} enabled={" " != l.char} onClick={onNewLetterClick} />))}&nbsp;
        {0 != newWord ? (<button onClick={onCheckWord}>⟰</button>) : null}
        <br />
        {letters.map((l, i) => (<Letter char={l.char} enabled={!l.isUsed} position={i} onClick={onLetterClick} />))}
        <br />
        Найденные слова:
        <ul>
          {findedWords.map(word => (<li class={alreadyFinded == word ? "finded" :
            lastFinded == word ? "newFinded" :
              ""}>{word}</li>))}
        </ul>
      </div>
    );
  }

  function GameOver() {
    /** @type {WordInfo[][]} */
    let wordsByLength = [];
    let wordKey = WordsManager.getWordKey(results.word);

    for (let word in WordsManager.words) {
      if (!WordsManager.checkTwoKeys(WordsManager.getWordKey(word), wordKey)) continue;
      if (!wordsByLength[word.length]) wordsByLength[word.length] = [];
      wordsByLength[word.length].push({
        word: word,
        price: Math.round(WordsManager.checkPrice(word) * 100) / 100,
        rarity: Math.round(WordsManager.checkRarity(word) * 100),
        isFound: results.findedWords.find(w => w == word) !== undefined
      });
    }
    return (
      <NewGame>
        <div>Результаты:</div>
        <div>Набрано очков: {results.score}</div>
        Найденные слова:<br />
        <WordsTable wordsByLength={wordsByLength} />
      </NewGame>
    );
  }

  switch (state) {
    case "prepare": return (<NewGame />);
    case "inGame": return (<InGame />);
    case "over": return (<GameOver />);
  }
}

function App() {
  const [gameState, setGameState] = useState("mainMenu");

  //const profile = CookieManager.get("profile") || {};

  function onNewGameClick() {
    setGameState("newGame");
  }
  function onBackClick() {
    setGameState("mainMenu");
  }

  return (<div>
    <h1>VX's Words</h1>
    {"mainMenu" == gameState ? (<MainMenu onNewGameClick={onNewGameClick} />) :
      (<Game onBackClick={onBackClick} />)}
  </div>)
}
ReactDOM.render(
  <App />,
  document.getElementById("app")
);