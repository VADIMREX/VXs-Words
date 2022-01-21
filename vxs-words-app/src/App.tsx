import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";

import { VXsWords } from "@vxs/vxs-words";

function App() {
  return (
    <ChakraProvider>
      <VXsWords />
    </ChakraProvider>
  )
}

export default App;