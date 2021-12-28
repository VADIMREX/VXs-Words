import { Button, VStack } from "@chakra-ui/react";
import WordsManager from "../libs/WordsManager";
import { WordsTable } from "./WordsTable";

export interface WordsDictionaryProps {
    onBackClick: () => void;
}

export function WordsDictionary(props: WordsDictionaryProps) {
    const wordsByLength = WordsManager.getWordsByLength();

    return (
        <VStack spacing={4} align='stretch'>
            <Button onClick={props.onBackClick}>Назад</Button>
            <WordsTable wordsByLength={wordsByLength} />
        </VStack>
    );
}
