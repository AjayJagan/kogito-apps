import React from 'react';
import { Title, Button, Bullseye } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import {
  Table,
  TableVariant,
  sortable,
  TableHeader,
  TableBody
} from '@patternfly/react-table';
import { TimeAgo } from '@n1ru4l/react-time-ago';
import EmptyStateSpinner from '../../../Atoms/SpinnerComponent/SpinnerComponent';

// append children basedon index
export const rowConverter = (_rows, loading) => {
  const copyOfRows = [..._rows];
  const tempRows = [];
  let offset = 0;
  copyOfRows.map((obj, idx) => {
    const tempObj = { ...obj };
    tempRows.push(tempObj);
    const children = tempObj.children;
    if (
      children !== undefined &&
      Object.keys(children).length !== 0 &&
      !loading
    ) {
      tempRows.push({ ...children, parent: idx + offset, isChildOpen: true });
      offset += 1;
    } else if (loading && Object.keys(children).length === 0) {
      tempRows.push({
        ...children,
        parent: idx + offset,
        cells: [
          {
            title: (
              <Bullseye>
                <EmptyStateSpinner spinnerText="Loading process instances..." />
              </Bullseye>
            )
          }
        ]
      });
      offset += 1;
    }
  });
  return tempRows;
};

// create parent-child encapsulation
export const createChildData = (childInstanceData, rows, expandId) => {
  const dataRows = [];
  let childObject = {};
  childInstanceData.data.ProcessInstances.map((childInstances, index) => {
    dataRows.push([
      {
        title: (
          <React.Fragment>
            <Title headingLevel="h3" size="lg">
              {childInstances.processName}
            </Title>
          </React.Fragment>
        )
      },
      {
        title: <React.Fragment>{childInstances.state}</React.Fragment>
      },
      '57 days ago',
      '1 day ago',
      {
        title: (
          <React.Fragment>
            <Button variant="plain" aria-label="Action">
              <EllipsisVIcon />
            </Button>
          </React.Fragment>
        )
      }
    ]);
  });

  const cells = [
    {
      title: (
        <React.Fragment>
          <Table
            aria-label="Sub-process Instances"
            variant={TableVariant.compact}
            cells={[
              { title: 'Subprocesses', transforms: [sortable] },
              { title: 'State', transforms: [sortable] },
              { title: 'Created', transforms: [sortable] },
              { title: 'Last update', transforms: [sortable] },
              ''
            ]}
            rows={dataRows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </React.Fragment>
      )
    }
  ];
  childObject = {
    fullWidth: true,
    cells,
    isChildLoaded: false,
    childId: childInstanceData.id
  };

  const copyOfRows = [...rows];
  copyOfRows.map(instance => {
    if (instance.id === expandId) {
      instance.children = childObject;
    }
  });
  return copyOfRows;
};

// create initial-parent data
export const createParentData = initData => {
  const instanceRows = [];
  initData.data.ProcessInstances.map(instance => {
    const cells = [];
    cells.push(
      {
        title: (
          <React.Fragment>
            <Title headingLevel="h3" size="lg">
              {instance.processName}
            </Title>
          </React.Fragment>
        )
      },
      {
        title: <React.Fragment>{instance.state}</React.Fragment>
      },
      '57 days ago',
      '1 day ago',
      {
        title: (
          <React.Fragment>
            <Button variant="plain" aria-label="Action">
              <EllipsisVIcon />
            </Button>
          </React.Fragment>
        )
      }
    );
    instanceRows.push({
      id: instance.id,
      isOpen: false,
      cells,
      children: {},
      isChildOpen: false
    });
  });
  return instanceRows;
};
