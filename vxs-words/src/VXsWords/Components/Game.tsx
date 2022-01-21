import React, { useState } from "react";
import { PrepareGame } from "./PrepareGame";
import { GameOver } from "./GameOver";
import { resultsModel } from "../Api/GameState";
import { InGame } from "./InGame";

export interface GameProps {
    onBackClick(): void;
}

export function Game(props: GameProps) {
    const [state, setState] = useState("prepare");
    const [word, setWord] = useState("");
    
    const [results, setResults] = useState<resultsModel>({ score: 0, findedWords: [], word: "" });

    function selectWord(word: string) {
        setWord(word);
        setState("inGame");
    }

    function onGameOver(results: resultsModel) {
        setState("over");
        setResults(results);
    }

    switch (state) {
        case "prepare": 
            return (<PrepareGame 
                onBackClick={props.onBackClick}
                onWordSelected={selectWord}
            />);
        case "inGame": 
            return (<InGame
                onGameOver={onGameOver}
                word={word}
            />);
        case "over": 
            return (<GameOver
                onBackClick={props.onBackClick}
                onWordSelected={selectWord}
                results={results}
            />);
    }

    throw new Error("Game: unknow state");
}