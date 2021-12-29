import { ChangeEvent, PropsWithChildren, useState } from "react";
import { Box, Button, Grid, GridItem, Input, VStack } from "@chakra-ui/react";
import WordsManager from "../libs/WordsManager";
import { PrepareGame } from "./PrepareGame";
import { WordInfo, WordsTable } from "./WordsTable";

export class GameState {

}

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
                <Button onClick={onClick} disabled={!props.enabled}>{props.char}</Button>
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
                <Button onClick={onGameOver.bind(null, { score, findedWords, word })}>Завершить</Button><br />
                <h2>{word}</h2>
                Очки: {Math.round(score * 100) / 100} {0 === score ? "" : (<span className={dScore > 0 ? "positive" : "negative"}>{dScore > 0 ? "+" : ""}{Math.round(dScore * 100) / 100}</span>)}<br />
                {newWord.map((l, i) => (<Letter char={l.char} position={i} enabled={" " !== l.char} onClick={onNewLetterClick} />))}&nbsp;
                {0 !== newWord.length ? (<Button onClick={onCheckWord}>⟰</Button>) : null}
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
            <PrepareGame 
                onBackClick={props.onBackClick}
                onWordSelected={selectWord}
            >
                <div>Результаты:</div>
                <div>Набрано очков: {results.score}</div>
                Найденные слова:<br />
                <WordsTable wordsByLength={wordsByLength} />
            </PrepareGame>
        );
    }

    switch (state) {
        case "prepare": return (<PrepareGame 
            onBackClick={props.onBackClick}
            onWordSelected={selectWord}
        />);
        case "inGame": return (<InGame />);
        case "over": return (<GameOver />);
    }

    throw new Error("Game: unknow state");
}