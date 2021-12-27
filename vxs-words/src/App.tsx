import { useState } from "react";

import { Box, ChakraProvider, Heading } from "@chakra-ui/react";
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
      <Box>
        <Heading>VX's Words</Heading>
        {"mainMenu" === gameState ? (<MainMenu onNewGameClick={onNewGameClick} />) :
          (<Game onBackClick={onBackClick} />)}
      </Box>
    </ChakraProvider>
  )
}

export default App;
