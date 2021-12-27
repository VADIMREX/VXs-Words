import { useState } from "react";

import { Box, ChakraProvider, Grid, GridItem, Heading } from "@chakra-ui/react";
import { MainMenu } from "./Components/MainMenu";
import { Game } from "./Components/Game";

function App() {
  const [gameState, setGameState] = useState("mainMenu");

  //const profile = CookieManager.get("profile") || {};

  function onNewGameClick() {
    setGameState("newGame");
  }
  function onBackClick() {
    setGameState("mainMenu");
  }

  return (
    <ChakraProvider>
      <Grid templateColumns='repeat(3, 1fr)'>
        <GridItem />
        <GridItem>
          <Heading>VX's Words</Heading>
          {"mainMenu" === gameState ? (<MainMenu onNewGameClick={onNewGameClick} />) :
            (<Game onBackClick={onBackClick} />)}
        </GridItem>
        <GridItem />
      </Grid>
    </ChakraProvider>
  )
}

export default App;
