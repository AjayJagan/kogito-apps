import { useApolloClient } from '@apollo/react-hooks';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Grid,
  GridItem,
  PageSection,
  Title,
  Button
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataListTitleComponent from '../../Molecules/DataListTitleComponent/DataListTitleComponent';
import DataToolbarComponent from '../../Molecules/DataToolbarComponent/DataToolbarComponent';
import './DataList.css';
import DataListComponent from '../../Organisms/DataListComponent/DataListComponent';
import EmptyStateComponent from '../../Atoms/EmptyStateComponent/EmptyStateComponent';
import DataTable from '../../Molecules/DataTableComponent/DataTable';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { createParentData } from '../../Molecules/DataTableComponent/Utils/helper';
import { useGetProcessInstancesLazyQuery } from 'packages/management-console/src/graphql/types';

const DataListContainer: React.FC<{}> = () => {
  const [initData, setInitData] = useState<any>([]);
  const [checkedArray, setCheckedArray] = useState<any>(['ACTIVE']);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isStatusSelected, setIsStatusSelected] = useState(true);
  const [filters, setFilters] = useState(checkedArray);
  const [rows, setRows] = useState([]);
  const [
    getProcessInstances,
    processInstances
  ] = useGetProcessInstancesLazyQuery({ fetchPolicy: 'network-only' });

  const onFilterClick = async (arr = checkedArray) => {
    setIsLoading(true);
    setIsError(false);
    setIsStatusSelected(true);
    getProcessInstances({ variables: { state: arr } });
  };

  useEffect(() => {
    setIsLoading(processInstances.loading);
    setInitData(processInstances.data);
    if (!processInstances.loading && processInstances.data) {
      const instanceRows = createParentData(processInstances);
      setRows(instanceRows);
    }
  }, [processInstances.data]);

  return (
    <React.Fragment>
      <PageSection variant="light">
        <DataListTitleComponent />
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={'/'}>Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Process instances</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Grid gutter="md">
          <GridItem span={12}>
            <Card className="dataList">
              {!isError && (
                <DataToolbarComponent
                  checkedArray={checkedArray}
                  filterClick={onFilterClick}
                  setCheckedArray={setCheckedArray}
                  setIsStatusSelected={setIsStatusSelected}
                  filters={filters}
                  setFilters={setFilters}
                />
              )}
              <DataTable rows={rows} setRows={setRows} isLoading={isLoading} />
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </React.Fragment>
  );
};

export default DataListContainer;
