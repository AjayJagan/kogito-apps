import {
  GraphQL,
  KogitoEmptyState,
  KogitoEmptyStateType,
  KogitoSpinner
} from '@kogito-apps/common';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React, { useEffect, useState } from 'react';

const SubTable = ({ parentProcessId }) => {
  const [rows, setRows] = useState([]);
  const { loading, error, data } = GraphQL.useGetChildInstancesQuery({
    variables: {
      rootProcessInstanceId: parentProcessId
    }
  });
  const columns = [
    {
      title: 'Id'
    },
    {
      title: 'Status'
    },
    {
      title: 'Created'
    },
    {
      title: 'Last update'
    }
  ];

  useEffect(() => {
    const tempRows = [];
    if (!loading && data) {
      data.ProcessInstances.forEach(child => {
        tempRows.push({
          cells: [child.id, child.state, child.start, child.lastUpdate]
        });
      });
      setRows(tempRows);
    }
  }, [data]);
  if (loading) {
    return <KogitoSpinner spinnerText={'Loading child instances'} />;
  }
  if (error) {
    return <div>error</div>;
  }
  if (!loading && data && data.ProcessInstances.length === 0) {
    return (
      <KogitoEmptyState
        type={KogitoEmptyStateType.Info}
        title="No child process instances"
        body="This process has no related sub processes"
      />
    );
  }
  return (
    <Table aria-label="Simple Table" cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default SubTable;
