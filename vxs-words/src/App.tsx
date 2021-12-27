import { PropsWithChildren } from "react";
import { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import OnlineConnection from "./libs/OnlineConnection";

import Profile from './libs/Profile';
import WordsManager from "./libs/WordsManager";

type WordInfo = {
  /** слово */
  word: string,
  /** редкость */
  rarity: number,
  /** стоимость */
  price: number,
  /** найдено? (для результатов) */
  isFound: boolean,
}

/**
 * Таблица слов разбитая по колонкам
 * @param props
 */
function WordsTable(props: { wordsByLength: WordInfo[][] }) {
  const { wordsByLength } = props;
  let res = [];
  let i = 0;
  let b;
  let header = [];
  for (let k = wordsByLength.length - 1; k > -1; k--)
    if (!wordsByLength[k] || 0 == wordsByLength[k].length) continue;
    else header.push((<th colSpan={3}>{k}</th>));
  res.push((<tr>{header}</tr>))
  do {
    let row = [];
    b = false;
    for (let k = wordsByLength.length - 1; k > -1; k--) {
      if (!wordsByLength[k] || 0 == wordsByLength[k].length) continue;
      if (!wordsByLength[k] || !wordsByLength[k][i]) {
        row.push((<td colSpan={3}></td>))
        continue;
      }
      b = true;
      let cell: string | JSX.Element = wordsByLength[k][i].word
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

/** Атрибуты основного меню  */
type MainMenuProps = {
  /** обаботчик кнопки новая игра */
  onNewGameClick: undefined | (() => void),
  /** обаботчик кнопки назад  */
  onBackClick?: undefined | (() => void),
}

/** 
 * Основное меню 
 * @param props
 */
function MainMenu(props: MainMenuProps) {
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
      <div className="menuContainer">
        <button className="menuButton" onClick={onNewGameClick}>Новая игра</button> <br />
        <button className="menuButton" onClick={() => setMenuState("dict")}>Посмотреть словарь</button> <br />
        <button className="menuButton" onClick={() => setMenuState("opts")}>Настройки</button> <br />
        <button className="menuButton" onClick={() => setMenuState("impexp")}>Импорт/Экспорт словаря</button><br />
        {
          props && props.onBackClick ?
            (<button className="menuButton" onClick={onBackClick}>Назад</button>) :
            (<br />)
        }
      </div>
    )
  }

  /** Просмотр словаря */
  function WordsDictionary() {
    let wordsByLength: WordInfo[][] = []
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
      <div className="menuContainer">
        <WordsTable wordsByLength={wordsByLength} />
      </div>
    );
  }

  /** Настройки */
  function Options() {
    //const { name } = Profile.instance;
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
        <button className="menuButton" onClick={onSaveContentOfflineClick}>Сохранить профиль</button>
        <button className="menuButton" onClick={onLoadContentOfflineClick}>Загрузить профиль</button>
      </div>);
    }
    function SaveLoadOffline() {
      return (<div>
        Локально<br />
        <button className="menuButton" onClick={onSaveContentOfflineClick}>Сохранить профиль</button>
        <button className="menuButton" onClick={onLoadContentOfflineClick}>Загрузить профиль</button>
      </div>);
    }
    return (
      <div className="menuContainer">
        <button className="menuButton" onClick={onBackToDefault}>Назад</button><br />
        <SaveLoadOnline />
        <SaveLoadOffline />
      </div>

    );
  }

  function Importer() {
    const [text, setText] = useState("");

    function onSaveClick(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      WordsManager.importText(text);
      onBackToDefault();
    }

    function onTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setText(event.target.value)
    }

    return (
      <form className="menuContainer" onSubmit={onSaveClick}>
        <input type="file" /><br />
        <textarea onChange={onTextChange}>{text}</textarea><br />
        <input className="menuButton" type="submit" value="Сохранить" />
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

function Game(props: { onBackClick: () => void }) {
  const [state, setState] = useState("prepare");
  const [word, setWord] = useState("");

  type resultsModel = {
    score: number,
    findedWords: string[],
    word: string,
  }
  const [results, setResults] = useState<resultsModel>({ score: 0, findedWords: [], word: ""});

  function onBackClick() {
    if (!props || !props.onBackClick) return;
    props.onBackClick();
  }

  function selectWord(word: string) {
    setWord(word);
    setState("inGame");
  }

  function onGameOver(results: resultsModel) {
    setState("over");
    setResults(results);
  }

  function NewGame(props: PropsWithChildren<any>) {
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

    function onSearchWordChanged(event: ChangeEvent<HTMLInputElement>) {
      setSearchWord(event.target.value);
    }

    return (
      <div className="menuContainer">
        {props.children}
        <button className="menuButton" onClick={onBackClick}>в главное меню</button><br />
        Случайные слова <button onClick={onRefreshRandom}>🗘</button><br />
        <table>
          <tr>
            <td><button className="menuButton" onClick={() => selectWord(rndWord[0])}>{rndWord[0]}</button></td>
            <td><button className="menuButton" onClick={() => selectWord(rndWord[1])}>{rndWord[1]}</button></td>
          </tr>
          <tr>
            <td><button className="menuButton" onClick={() => selectWord(rndWord[2])}>{rndWord[2]}</button></td>
            <td><button className="menuButton" onClick={() => selectWord(rndWord[3])}>{rndWord[3]}</button></td>
          </tr>
        </table>
        <input type="text" value={searchWord} onChange={onSearchWordChanged} />
        <div>
          {findedWords.map((item) => (<button className="menuButton" onClick={() => selectWord(item)}>{item}</button>))}
        </div>
      </div>
    );
  }

  function InGame(props: any) {
    const [score, setScore] = useState(0);
    const [dScore, setDScore] = useState(0);

    type letterModel = {
      char: string,
      isUsed: boolean,
    }

    const [letters, setLetters] = useState<letterModel[]>((
      Array.from(word)
        .map(ch => {
          return {
            char: ch,
            isUsed: false
          }
        })
    ));

    type newLetterModel = {
      char: string,
      fromLetter: number,
    }

    const [newWord, setNewWord] = useState<newLetterModel[]>([]);
    const [findedWords, setFindedWords] = useState<string[]>([]);
    const [alreadyFinded, setAlreadyFinded] = useState("");
    const [lastFinded, setLastFinded] = useState("");

    function Letter(props: {
      char: string,
      enabled: boolean,
      position: number,
      onClick: (position: number) => void
    }) {
      if (undefined === props.enabled) props.enabled = true;
      function onClick() {
        if (props.onClick) props.onClick(props.position);
      }
      return (
        <button onClick={onClick} disabled={!props.enabled}>{props.char}</button>
      )
    }

    function setLetterUsed(position: number, isUsed: boolean) {
      let dLetters: letterModel[] = ([] as letterModel[]).concat(letters);
      dLetters[position].isUsed = isUsed;
      setLetters(dLetters);
    }

    function onLetterClick(position: number) {
      setLetterUsed(position, true);
      let dNewWord = ([] as newLetterModel[]).concat(newWord);
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
    function onNewLetterClick(position: number) {
      let dNewWord = ([] as newLetterModel[]).concat(newWord);
      setLetterUsed(dNewWord[position].fromLetter, false);
      dNewWord[position] = {
        char: " ",
        fromLetter: -1
      }
      setNewWord(dNewWord);
    }

    function changeScore(price: number) {
      setScore(score + price);
      setDScore(price);
    }

    /** Оценить слово */
    function onCheckWord() {
      let sWord = newWord.map(x => " " == x.char ? "" : x.char).join("");
      setLastFinded(sWord);
      setNewWord([]);
      let dLetters = ([] as letterModel[]).concat(letters);
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
      <div className="menuContainer">
        <button className="menuButton" onClick={onGameOver.bind(null, { score, findedWords, word })}>Завершить</button><br />
        <h2>{word}</h2>
        Очки: {Math.round(score * 100) / 100} {0 == score ? "" : (<span className={dScore > 0 ? "positive" : "negative"}>{dScore > 0 ? "+" : ""}{Math.round(dScore * 100) / 100}</span>)}<br />
        {newWord.map((l, i) => (<Letter char={l.char} position={i} enabled={" " != l.char} onClick={onNewLetterClick} />))}&nbsp;
        {0 != newWord.length ? (<button onClick={onCheckWord}>⟰</button>) : null}
        <br />
        {letters.map((l, i) => (<Letter char={l.char} enabled={!l.isUsed} position={i} onClick={onLetterClick} />))}
        <br />
        Найденные слова:
        <ul>
          {findedWords.map(word => (<li className={alreadyFinded == word ? "finded" :
            lastFinded == word ? "newFinded" :
              ""}>{word}</li>))}
        </ul>
      </div>
    );
  }

  function GameOver() {
    let wordsByLength: WordInfo[][] = [];
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

  throw new Error("Game: unknow state");
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

export default App;
