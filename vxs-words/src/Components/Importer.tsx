import { Button, Input, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import WordsManager from "../Api/WordsManager";

export interface ImporterProps {
    onBackClick(): void;
    onSaveClick(value: string): void;
}

export function Importer(props: ImporterProps) {
    const [text, setText] = useState(WordsManager.getText().join());

    function onTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value)
    }

    function onSaveClick() {
        props.onSaveClick(text);
    }

    return (
        <VStack spacing={4} align='stretch'>
            <Button onClick={props.onBackClick}>Назад</Button>
            <Input type="file" />
            <Textarea onChange={onTextChange} value={text} placeholder="Место для вставки слов" />
            <Button
                // mt={4}
                colorScheme='teal'
                // isLoading={props.isSubmitting}
                // type='submit'
                onClick={onSaveClick}
            >
                Сохранить
            </Button>
        </VStack>
    );
}