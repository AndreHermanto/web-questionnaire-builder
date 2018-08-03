import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Mutation, QueryResource } from 'web-components';
import { responseReportSchema } from './schemas';
import { questionnairesSchema } from '../Questionnaires/schemas';
import ReportsForm from './ReportsForm';

export default function ReportsCreate({ history }) {
  return (
    <div>
      <QueryResource
        queries={[
          {
            resourceName: 'questionnaires',
            url: '/questionnaires',
            schema: questionnairesSchema,
          },
        ]}
      >
        {({ questionnaires }) => (
          <Mutation
            resourceName="responseReports"
            url={'/responses-reports'}
            schema={responseReportSchema}
            post={mutationResponse =>
              history.push(`/response-reports/${mutationResponse.payload.result}`)
            }
            render={({ create, loading: pending, error }) => {
              if (pending) {
                return <div>Creating report...</div>;
              }
              if (error) {
                return <div>Error: {error}</div>;
              }
              return (
                <Grid centered columns={2}>
                  <Grid.Column width={12}>
                    <ReportsForm
                      onSubmit={values => create({ query: values })}
                      questionnaires={questionnaires}
                    />
                  </Grid.Column>
                </Grid>
              );
            }}
          />
        )}
      </QueryResource>
    </div>
  );
}

ReportsCreate.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
