import { Button, VStack } from "@chakra-ui/react";

/** Атрибуты основного меню  */
export interface MainMenuOldProps {
    /** обаботчик кнопки новая игра */
    onNewGameClick?: (() => void),
    /** обаботчик кнопки назад  */
    onBackClick?: (() => void),
}

export interface MainMenuProps {
    onNewGameClick: () => void;
    onShowDictionaryClick: () => void;
    onOptionsClick: () => void;
    onImportClick: () => void;
}

export function MainMenu(props: MainMenuProps) {
    return (
        <VStack spacing={4} align='stretch'>
            <Button onClick={props.onNewGameClick}>Новая игра</Button> <br />
            <Button onClick={props.onShowDictionaryClick}>Посмотреть словарь</Button> <br />
            <Button onClick={props.onOptionsClick}>Настройки</Button> <br />
            <Button onClick={props.onImportClick}>Импорт/Экспорт словаря</Button><br />
        </VStack>
    );
}