import { Button } from "@chakra-ui/react";
import { useState } from "react";
import WordsManager from "../Api/WordsManager";
import { resultsModel } from "../Api/GameState";

export interface InGameProps {
    word: string;
    onGameOver(results: resultsModel): void;
}

export function InGame(props: InGameProps) {
    const [score, setScore] = useState(0);
    const [dScore, setDScore] = useState(0);

    type letterModel = {
        char: string,
        isUsed: boolean,
    }

    const [letters, setLetters] = useState<letterModel[]>((
        Array.from(props.word)
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
            <Button onClick={props.onGameOver.bind(null, { score, findedWords, word: props.word })}>Завершить</Button><br />
            <h2>{props.word}</h2>
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