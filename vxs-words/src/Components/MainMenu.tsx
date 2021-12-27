import { useEffect, useState } from "react";
import { Button, Textarea, VStack } from "@chakra-ui/react";
import OnlineConnection from "../libs/OnlineConnection";
import Profile from "../libs/Profile";
import WordsManager from "../libs/WordsManager";
import { WordInfo, WordsTable } from "./WordsTable";

/** Атрибуты основного меню  */
export interface MainMenuProps {
    /** обаботчик кнопки новая игра */
    onNewGameClick?: (() => void),
    /** обаботчик кнопки назад  */
    onBackClick?: (() => void),
}

/** 
 * Основное меню 
 * @param props
 */
export function MainMenu(props: MainMenuProps) {
    let [menuState, setMenuState] = useState("main");

    function onNewGameClick() {
        if (!props || !props.onNewGameClick) return;
        props.onNewGameClick();
    }

    function onBackClick() {
        if (!props || !props.onBackClick) return;
        props.onBackClick();
    }

    function onBackToDefault() {
        setMenuState("mainMenu")
    }

    /** базовое состояние меню */
    function DefaultMenu() {
        return (
            <VStack spacing={4} align='stretch'>
                <Button onClick={onNewGameClick}>Новая игра</Button> <br />
                <Button onClick={() => setMenuState("dict")}>Посмотреть словарь</Button> <br />
                <Button onClick={() => setMenuState("opts")}>Настройки</Button> <br />
                <Button onClick={() => setMenuState("impexp")}>Импорт/Экспорт словаря</Button><br />
                {
                    props && props.onBackClick ?
                        (<Button onClick={onBackClick}>Назад</Button>) :
                        (<br />)
                }
            </VStack>
        )
    }

    /** Просмотр словаря */
    function WordsDictionary() {
        let wordsByLength: WordInfo[][] = []
        for (let word in WordsManager.words) {
            if (!wordsByLength[word.length]) wordsByLength[word.length] = [];
            wordsByLength[word.length].push({
                word: word,
                price: Math.round(WordsManager.checkPrice(word) * 100) / 100,
                rarity: Math.round(WordsManager.checkRarity(word) * 100),
                isFound: false
            });
        }

        return (
            <div className="menuContainer">
                <WordsTable wordsByLength={wordsByLength} />
            </div>
        );
    }

    /** Настройки */
    function Options() {
        //const { name } = Profile.instance;
        function onLoadContentOfflineClick() {
            Profile.loadProfileOffline();
        }
        function onSaveContentOfflineClick() {
            Profile.saveProfileOffline();
        }
        function SaveLoadOnline() {
            const [isConnected, setIsConnected] = useState(OnlineConnection.isConnected);
            useEffect(() => {
                OnlineConnection.onIsOnlineChanged.subscribe(setIsConnected);
                return () => OnlineConnection.onIsOnlineChanged.unsubscribe(setIsConnected);
            });
            if (!isConnected) return null;
            return (<div>
                Онлайн<br />
                <Button onClick={onSaveContentOfflineClick}>Сохранить профиль</Button>
                <Button onClick={onLoadContentOfflineClick}>Загрузить профиль</Button>
            </div>);
        }
        function SaveLoadOffline() {
            return (<div>
                Локально<br />
                <Button onClick={onSaveContentOfflineClick}>Сохранить профиль</Button>
                <Button onClick={onLoadContentOfflineClick}>Загрузить профиль</Button>
            </div>);
        }
        return (
            <div className="menuContainer">
                <Button onClick={onBackToDefault}>Назад</Button><br />
                <SaveLoadOnline />
                <SaveLoadOffline />
            </div>

        );
    }

    function Importer() {
        const [text, setText] = useState("");

        function onSaveClick(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault();
            WordsManager.importText(text);
            onBackToDefault();
        }

        function onTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
            setText(event.target.value)
        }

        return (
            <form className="menuContainer" onSubmit={onSaveClick}>
                <input type="file" /><br />
                <Textarea onChange={onTextChange} value={text} placeholder="Место для вставки слов" /><br />
                <Button
                    // mt={4}
                    // colorScheme='teal'
                    // isLoading={props.isSubmitting}
                    type='submit'
                >
                    Сохранить
                </Button>
            </form>
        );
    }

    switch (menuState) {
        case "main":
        default: return (<DefaultMenu />);
        case "opts":
            return (<Options />)
        case "dict":
            return (<WordsDictionary />)
        case "impexp":
            return (<Importer />)
    }
}
