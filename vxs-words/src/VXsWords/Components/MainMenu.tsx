import { Button, VStack } from "@chakra-ui/react";

/** Атрибуты основного меню  */
export interface MainMenuProps {
    onNewGameClick(): void;
    onShowDictionaryClick(): void;
    onOptionsClick(): void;
    onImportClick(): void;
}

export function MainMenu(props: MainMenuProps) {
    return (
        <VStack spacing={4} align='stretch'>
            <Button onClick={props.onNewGameClick}>Новая игра</Button>
            <Button onClick={props.onShowDictionaryClick}>Посмотреть словарь</Button>
            <Button onClick={props.onOptionsClick}>Настройки</Button>
            <Button onClick={props.onImportClick}>Импорт/Экспорт словаря</Button>
        </VStack>
    );
}