import WordsManager from "../Api/WordsManager";
import { resultsModel } from "../Api/GameState";
import { PrepareGame } from "./PrepareGame";
import { WordInfo, WordsTable } from "./WordsTable";

export interface GameOverProps {
    onBackClick(): void;
    onWordSelected(word: string): void;
    results: resultsModel;
}

export function GameOver(props: GameOverProps) {
    let wordsByLength: WordInfo[][] = [];
    let wordKey = WordsManager.getWordKey(props.results.word);

    for (let word in WordsManager.words) {
        if (!WordsManager.checkTwoKeys(WordsManager.getWordKey(word), wordKey)) continue;
        if (!wordsByLength[word.length]) wordsByLength[word.length] = [];
        wordsByLength[word.length].push({
            word: word,
            price: Math.round(WordsManager.checkPrice(word) * 100) / 100,
            rarity: Math.round(WordsManager.checkRarity(word) * 100),
            isFound: props.results.findedWords.find(w => w === word) !== undefined
        });
    }

    return (
        <PrepareGame 
            onBackClick={props.onBackClick}
            onWordSelected={props.onWordSelected}
        >
            <div>Результаты:</div>
            <div>Набрано очков: {props.results.score}</div>
            Найденные слова:<br />
            <WordsTable wordsByLength={wordsByLength} />
        </PrepareGame>
    );
}