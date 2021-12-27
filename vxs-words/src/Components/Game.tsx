import { ChangeEvent, PropsWithChildren, useState } from "react";
import WordsManager from "../libs/WordsManager";
import { WordInfo, WordsTable } from "./WordsTable";

export function Game(props: { onBackClick: () => void }) {
    const [state, setState] = useState("prepare");
    const [word, setWord] = useState("");

    type resultsModel = {
        score: number,
        findedWords: string[],
        word: string,
    }
    const [results, setResults] = useState<resultsModel>({ score: 0, findedWords: [], word: "" });

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
                if (" " === dNewWord[i].char) break;
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
            let sWord = newWord.map(x => " " === x.char ? "" : x.char).join("");
            setLastFinded(sWord);
            setNewWord([]);
            let dLetters = ([] as letterModel[]).concat(letters);
            for (let i in dLetters) dLetters[i].isUsed = false;
            setLetters(dLetters);
            let letterPrice = WordsManager.checkPrice(sWord);
            if (-1 === letterPrice) return changeScore(letterPrice);
            let isAlreadyFinded = findedWords.find(x => x === sWord);
            if (isAlreadyFinded) setAlreadyFinded(isAlreadyFinded);
            else setFindedWords([sWord].concat(findedWords));
            changeScore(isAlreadyFinded ? 0 : letterPrice);
        }

        return (
            <div className="menuContainer">
                <button className="menuButton" onClick={onGameOver.bind(null, { score, findedWords, word })}>Завершить</button><br />
                <h2>{word}</h2>
                Очки: {Math.round(score * 100) / 100} {0 === score ? "" : (<span className={dScore > 0 ? "positive" : "negative"}>{dScore > 0 ? "+" : ""}{Math.round(dScore * 100) / 100}</span>)}<br />
                {newWord.map((l, i) => (<Letter char={l.char} position={i} enabled={" " !== l.char} onClick={onNewLetterClick} />))}&nbsp;
                {0 !== newWord.length ? (<button onClick={onCheckWord}>⟰</button>) : null}
                <br />
                {letters.map((l, i) => (<Letter char={l.char} enabled={!l.isUsed} position={i} onClick={onLetterClick} />))}
                <br />
                Найденные слова:
                <ul>
                    {findedWords.map(word => (<li className={alreadyFinded === word ? "finded" :
                        lastFinded === word ? "newFinded" :
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
                isFound: results.findedWords.find(w => w === word) !== undefined
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