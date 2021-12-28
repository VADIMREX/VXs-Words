import { useState } from "react";

import { ChakraProvider, Grid, GridItem, Heading } from "@chakra-ui/react";

import { MainMenu } from "./Components/MainMenu";
import { Importer } from "./Components/Importer";
import { Options } from "./Components/Options";
import { WordsDictionary } from "./Components/WordsDictionary";

import { Game } from "./Components/Game";

import WordsManager from "./libs/WordsManager";

type states = "newGame" | "mainMenu" | "importer" | "options" | "dictionary";

function App() {
  const [gameState, setGameState] = useState<states>("mainMenu");

  //const profile = CookieManager.get("profile") || {};

  function Frames(props: any) {
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
          onSaveClick={function(text) {
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
    <ChakraProvider>
      <Grid templateColumns='repeat(3, 1fr)'>
        <GridItem />
        <GridItem>
          <Heading>VX's Words</Heading><br />
          <Frames />
        </GridItem>
        <GridItem />
      </Grid>
    </ChakraProvider>
  )
}

export default App;
