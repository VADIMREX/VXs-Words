import React from 'react';
import { Table, Tr, Th, Td, Thead, Tbody } from '@chakra-ui/react'
import { WordInfo } from '../Api/WordsManager';

export interface WordsTableProps {
    wordsByLength: WordInfo[][]
}

/**
* Таблица слов разбитая по колонкам
* @param props
*/
export function WordsTable(props: WordsTableProps) {
    const { wordsByLength } = props;
    let i = 0;
    let b;
    let header: JSX.Element[] | JSX.Element = [];
    for (let k = wordsByLength.length - 1; k > -1; k--)
        if (!wordsByLength[k] || 0 === wordsByLength[k].length) continue;
        else header.push((<Th colSpan={3}>{k}</Th>));
    header = (<Thead>{header}</Thead>)
    let body = []
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
        if (b) body.push((<Tr>{row}</Tr>));
        i++;
    } while (b);
    return (
        <Table variant='simple'>
            {header}
            <Tbody>{body}</Tbody>
        </Table>
    );
}