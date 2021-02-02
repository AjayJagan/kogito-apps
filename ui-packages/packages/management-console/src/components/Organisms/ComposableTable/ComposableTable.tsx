import React, { useEffect, useState } from 'react';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent
} from '@patternfly/react-table';
import {
  EndpointLink,
  GraphQL,
  ItemDescriptor,
  KogitoSpinner
} from '@kogito-apps/common';
import {
  getProcessInstanceDescription,
  ProcessInstanceIconCreator
} from 'packages/management-console/src/utils/Utils';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { HistoryIcon } from '@patternfly/react-icons';
import SubTable from './SubTable';

const ComposableTableExpandable = () => {
  const [rowPairs, setRowPairs] = useState([]);
  const queryVariables = {
    state: {
      in: [
        GraphQL.ProcessInstanceState.Active,
        GraphQL.ProcessInstanceState.Completed,
        GraphQL.ProcessInstanceState.Aborted
      ]
    },
    parentProcessInstanceId: { isNull: true }
  };
  //@ts-ignore
  const { loading, error, data } = GraphQL.useGetProcessInstancesQuery({
    variables: {
      where: queryVariables,
      offset: 0,
      limit: 200
    },
    fetchPolicy: 'network-only'
  });

  const columns = ['Id', 'Status', 'Created', 'Last update'];

  const numColumns = columns.length;
  // Init all to false
  //@ts-ignore
  const [expanded, setExpanded] = React.useState({});
  const LoadChild = (parent, parentIndex) => {
    if (!expanded[parentIndex]) {
      return null;
    } else {
      return <SubTable parentProcessId={parent} />;
    }
  };

  useEffect(() => {
    const tempRowPairs = [];
    if (!loading && data) {
      data.ProcessInstances.forEach((processInstance: any, i) => {
        tempRowPairs.push({
          parent: [
            <>
              <Link
                to={{
                  pathname: '/Process/' + processInstance.id
                }}
              >
                <div>
                  <strong>
                    <ItemDescriptor
                      itemDescription={getProcessInstanceDescription(
                        processInstance
                      )}
                    />
                  </strong>
                </div>
              </Link>
              <EndpointLink
                serviceUrl={processInstance.serviceUrl}
                isLinkShown={false}
              />
            </>,
            ProcessInstanceIconCreator(processInstance.state),
            processInstance.start ? (
              <Moment fromNow>{new Date(`${processInstance.start}`)}</Moment>
            ) : (
              ''
            ),
            processInstance.lastUpdate ? (
              <span>
                {' '}
                <HistoryIcon className="pf-u-mr-sm" /> Updated{' '}
                <Moment fromNow>
                  {new Date(`${processInstance.lastUpdate}`)}
                </Moment>
              </span>
            ) : (
              ''
            )
          ],
          child: [processInstance.id]
        });
        expanded[i] = false;
      });
      setRowPairs(tempRowPairs);
    }
  }, [data]);
  if (loading) {
    return <KogitoSpinner spinnerText={'Loading...'} />;
  }

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
        {!loading &&
          data &&
          rowPairs.length > 0 &&
          rowPairs.map((pair, pairIndex) => {
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
