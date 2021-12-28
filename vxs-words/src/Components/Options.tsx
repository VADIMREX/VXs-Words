import { Button, VStack } from "@chakra-ui/react";

export interface OptionsProps {
    onBackClick: () => void;
}

export function Options(props: OptionsProps) {
    return (
        <VStack spacing={4} align='stretch'>
            <Button onClick={props.onBackClick}>Назад</Button>
        </VStack>
    );
}

//     /** Настройки */
//     function Options() {
//         //const { name } = Profile.instance;
//         function onLoadContentOfflineClick() {
//             Profile.loadProfileOffline();
//         }
//         function onSaveContentOfflineClick() {
//             Profile.saveProfileOffline();
//         }
//         function SaveLoadOnline() {
//             const [isConnected, setIsConnected] = useState(OnlineConnection.isConnected);
//             useEffect(() => {
//                 OnlineConnection.onIsOnlineChanged.subscribe(setIsConnected);
//                 return () => OnlineConnection.onIsOnlineChanged.unsubscribe(setIsConnected);
//             });
//             if (!isConnected) return null;
//             return (<div>
//                 Онлайн<br />
//                 <Button onClick={onSaveContentOfflineClick}>Сохранить профиль</Button>
//                 <Button onClick={onLoadContentOfflineClick}>Загрузить профиль</Button>
//             </div>);
//         }
//         function SaveLoadOffline() {
//             return (<div>
//                 Локально<br />
//                 <Button onClick={onSaveContentOfflineClick}>Сохранить профиль</Button>
//                 <Button onClick={onLoadContentOfflineClick}>Загрузить профиль</Button>
//             </div>);
//         }
//         return (
//             <div className="menuContainer">
//                 <Button onClick={onBackToDefault}>Назад</Button><br />
//                 <SaveLoadOnline />
//                 <SaveLoadOffline />
//             </div>

//         );
//     }