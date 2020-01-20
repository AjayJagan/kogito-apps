import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  expandable
} from '@patternfly/react-table';
import { Bullseye } from '@patternfly/react-core';
import {
  useGetProcessInstancesQuery,
  ProcessInstanceState,
  useGetChildInstancesLazyQuery
} from '../../../graphql/types';
import EmptyStateSpinner from '../../Atoms/SpinnerComponent/SpinnerComponent';
import {
  rowConverter,
  createChildData,
  createParentData
} from './Utils/helper';

interface IOwnProps {
  rows: any;
  setRows: any;
  isLoading: boolean;
}
const CollapsibleTable: React.FC<IOwnProps> = ({
  rows,
  setRows,
  isLoading
}) => {
  const [columns, setColumns] = useState([
    { title: 'Process', cellFormatters: [expandable] },
    'State',
    { title: 'Created' },
    'Last update',
    ''
  ]);
  const [expandId, setExpandId] = useState(null);

  const initData = useGetProcessInstancesQuery({
    variables: { state: [ProcessInstanceState.Active] },
    fetchPolicy: 'network-only'
  });

  const [
    getChildInstances,
    childInstanceData
  ] = useGetChildInstancesLazyQuery();

  useEffect(() => {
    if (!initData.loading && initData.data) {
      const instanceRows = createParentData(initData);
      setRows(instanceRows);
    }
  }, [initData.data]);

  const onCollapse = (event, rowIndex, isOpen, rowData) => {
    const copyOfRows = [...rows];
    copyOfRows.map(row => {
      if (row.id === rowData.id) {
        row.isOpen = isOpen;
        return;
      }
    });
    setExpandId(rowData.id);
    getChildInstances({ variables: { instanceId: rowData.id } });
    setRows(copyOfRows);
  };

  useEffect(() => {
    if (!childInstanceData.loading && childInstanceData.data) {
      const copyOfRows = createChildData(childInstanceData, rows, expandId);
      setRows(copyOfRows);
    }
  }, [childInstanceData.data]);

  const tableData = rowConverter(rows, childInstanceData.loading);

  if (initData.loading || isLoading) {
    return (
      <Bullseye>
        <EmptyStateSpinner spinnerText="Loading process instances..." />
      </Bullseye>
    );
  }
  return (
    <div>
      {!initData.loading && (
        <Table
          aria-label="Collapsible table"
          rows={tableData}
          cells={columns}
          onCollapse={onCollapse}
        >
          <TableHeader />
          <TableBody />
        </Table>
      )}
    </div>
  );
};

export default CollapsibleTable;
