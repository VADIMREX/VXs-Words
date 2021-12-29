import { ChangeEvent, PropsWithChildren, useState } from "react";
import { Box, Button, Grid, GridItem, Input, VStack } from "@chakra-ui/react";
import WordsManager from "../libs/WordsManager";

export interface PrepareGameProps {
    onBackClick(): void;
    onWordSelected(word: string): void;
}

export function PrepareGame(props: PropsWithChildren<PrepareGameProps>) {
    function getRandomWords() {
        return [
            WordsManager.getRndWord(),
            WordsManager.getRndWord(),
            WordsManager.getRndWord(),
            WordsManager.getRndWord()
        ];
    }

    const [rndWord, setRndWord] = useState(getRandomWords());
    const [searchWord, setSearchWord] = useState("");
    const [findedWords, setFindedWords] = useState<string[]>([]);

    function onRefreshRandom() {
        setRndWord(getRandomWords());
    }

    let selectWord = props.onWordSelected;
    function WordButton(props: { word: string }) {
        return (<Button width="100%" onClick={() => selectWord(props.word)}>{props.word}</Button>)
    }

    function onSearchWordChanged(event: ChangeEvent<HTMLInputElement>) {
        setSearchWord(event.target.value);
    }

    return (
        <VStack spacing={4} align='stretch'>
            {props.children}
            <Button onClick={props.onBackClick}>в главное меню</Button>
            <Box>Случайные слова <Button onClick={onRefreshRandom}>🗘</Button></Box>
            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                <GridItem><WordButton word={rndWord[0]} /></GridItem>
                <GridItem><WordButton word={rndWord[1]} /></GridItem>
                <GridItem><WordButton word={rndWord[2]} /></GridItem>
                <GridItem><WordButton word={rndWord[3]} /></GridItem>
            </Grid>
            <Input type="text" value={searchWord} onChange={onSearchWordChanged} />
            <Box>{findedWords.map((item) => (<WordButton word={item} />))}</Box>
        </VStack>
    );
}