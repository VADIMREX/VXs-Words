import React, { useState } from "react";

import { Grid, GridItem, Heading } from "@chakra-ui/react";

import { MainMenu } from "./Components/MainMenu";
import { Importer } from "./Components/Importer";
import { Options } from "./Components/Options";
import { WordsDictionary } from "./Components/WordsDictionary";

import { Game } from "./Components/Game";

import WordsManager from "./Api/WordsManager";

type states = "newGame" | "mainMenu" | "importer" | "options" | "dictionary";

export function VXsWords(_props: any) {
    const [gameState, setGameState] = useState<states>("mainMenu");

    //const profile = CookieManager.get("profile") || {};

    function Frames(_props: any) {
        switch (gameState) {
            case "newGame": return (
                <Game
                    onBackClick={() => setGameState("mainMenu")}
                />
            );
            case "mainMenu": return (
                <MainMenu
                    onNewGameClick={() => setGameState("newGame")}
                    onImportClick={() => setGameState("importer")}
                    onOptionsClick={() => setGameState("options")}
                    onShowDictionaryClick={() => setGameState("dictionary")}
                />)
            case "importer": return (
                <Importer
                    onBackClick={() => setGameState("mainMenu")}
                    onSaveClick={function (text) {
                        WordsManager.importText(text)
                        setGameState("mainMenu");
                    }}
                />
            );
            case "dictionary": console.log(1); return (
                <WordsDictionary
                    onBackClick={() => setGameState("mainMenu")}
                />
            );
            case "options": return (
                <Options
                    onBackClick={() => setGameState("mainMenu")}
                />
            );
        }
    }

    return (
        <Grid templateColumns='repeat(3, 1fr)'>
            <GridItem />
            <GridItem>
                <Heading>VX's Words</Heading><br />
                <Frames />
            </GridItem>
            <GridItem />
        </Grid>
    )
}

export default VXsWords;