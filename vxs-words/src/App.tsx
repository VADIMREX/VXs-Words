import { ChakraProvider } from "@chakra-ui/react";

import VXsWords from "./VXsWords/VXsWords";

function App() {
  return (
    <ChakraProvider>
      <VXsWords/>
    </ChakraProvider>
  )
}

export default App;
