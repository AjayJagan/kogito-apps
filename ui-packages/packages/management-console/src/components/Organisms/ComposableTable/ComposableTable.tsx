import React from 'react';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent
} from '@patternfly/react-table';

const ComposableTableExpandable = () => {
  const columns = ['Repositories', 'Branches', 'Pull requests', 'Workspaces'];

  const rowPairs = [];
  for (let i = 0; i < 1000; i++) {
    rowPairs.push({
      parent: [`one-${i}`, `two-${i}`, `three-${i}`, `four-${i}`],
      child: [`child-${i}`]
    });
  }

  const numColumns = columns.length;
  // Init all to false
  const [expanded, setExpanded] = React.useState(
    //@ts-ignore
    Object.fromEntries(Object.entries(rowPairs).map(([k, v]) => [k, false]))
  );
  const LoadChild = (parent, parentIndex) => {
    if (!expanded[parentIndex]) {
      return null; //empty content
    } else {
      // call graphql
      // await for the result
      // create the sub-table
      return `child-${parentIndex}`;
    }
  };
  return (
    <React.Fragment>
      <TableComposable aria-label="Expandable Table" variant={'compact'}>
        <Thead>
          <Tr>
            <Th />
            <Th>{columns[0]}</Th>
            <Th>{columns[1]}</Th>
            <Th>{columns[2]}</Th>
            <Th>{columns[3]}</Th>
            <Th>{columns[4]}</Th>
          </Tr>
        </Thead>
        {rowPairs.map((pair, pairIndex) => {
          const parentRow = (
            <Tr key={`${pairIndex}-parent`}>
              <Td
                key={`${pairIndex}-parent-0`}
                expand={{
                  rowIndex: pairIndex,
                  isExpanded: expanded[pairIndex],
                  onToggle: event =>
                    setExpanded({
                      ...expanded,
                      [pairIndex]: !expanded[pairIndex]
                    })
                }}
              />
              {pair.parent.map((cell, cellIndex) => (
                <Td
                  key={`${pairIndex}-parent-${++cellIndex}`}
                  dataLabel={columns[cellIndex]}
                >
                  {cell}
                </Td>
              ))}
            </Tr>
          );
          const childRow = (
            <Tr
              key={`${pairIndex}-child`}
              isExpanded={expanded[pairIndex] === true}
            >
              <Td key={`${pairIndex}-child-0`} />
              {rowPairs[pairIndex].child.map((cell, cellIndex) => (
                <Td
                  key={`${pairIndex}-child-${++cellIndex}`}
                  dataLabel={columns[cellIndex]}
                  noPadding={rowPairs[pairIndex].noPadding}
                  colSpan={numColumns}
                >
                  <ExpandableRowContent>
                    {LoadChild(cell, pairIndex)}
                  </ExpandableRowContent>
                </Td>
              ))}
            </Tr>
          );
          return (
            <Tbody key={pairIndex} isExpanded={expanded[pairIndex] === true}>
              {parentRow}
              {childRow}
            </Tbody>
          );
        })}
      </TableComposable>
    </React.Fragment>
  );
};

export default ComposableTableExpandable;
