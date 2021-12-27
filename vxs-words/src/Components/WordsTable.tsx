import { Table, Tr, Th, Td } from '@chakra-ui/react'

export interface WordInfo {
    /** слово */
    word: string,
    /** редкость */
    rarity: number,
    /** стоимость */
    price: number,
    /** найдено? (для результатов) */
    isFound: boolean,
}

/**
* Таблица слов разбитая по колонкам
* @param props
*/
export function WordsTable(props: { wordsByLength: WordInfo[][] }) {
    const { wordsByLength } = props;
    let res = [];
    let i = 0;
    let b;
    let header = [];
    for (let k = wordsByLength.length - 1; k > -1; k--)
        if (!wordsByLength[k] || 0 === wordsByLength[k].length) continue;
        else header.push((<Th colSpan={3}>{k}</Th>));
    res.push((<tr>{header}</tr>))
    do {
        let row = [];
        b = false;
        for (let k = wordsByLength.length - 1; k > -1; k--) {
            if (!wordsByLength[k] || 0 === wordsByLength[k].length) continue;
            if (!wordsByLength[k] || !wordsByLength[k][i]) {
                row.push((<Td colSpan={3}></Td>))
                continue;
            }
            b = true;
            let cell: string | JSX.Element = wordsByLength[k][i].word
            if (wordsByLength[k][i].isFound) cell = (<b>{cell}</b>);
            row.push((<Td>{cell}</Td>),
                (<Td>{wordsByLength[k][i].price}</Td>),
                (<Td>{wordsByLength[k][i].rarity}</Td>));
        }
        if (b) res.push((<Tr>{row}</Tr>));
        i++;
    } while (b);
    return (
        <Table variant='simple'>
            {res}
        </Table>
    );
}