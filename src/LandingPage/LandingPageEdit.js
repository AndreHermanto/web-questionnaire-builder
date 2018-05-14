import React from 'react';
import PropTypes from 'prop-types';
import { Resource, Mutation } from 'web-components';
import { headingSchema } from './schemas';
import LandingPageForm from './LandingPageForm';

export default function LandingPageEdit({
  closePanel,
  match: {
    params: { consentTypeId },
  },
}) {
  return (
    <Resource
      resourceName="headingsData"
      filter={{ consentTypeId }}
      render={({ headingsData }) => {
        if (!headingsData.length) {
          return <div>Error: Data not found.</div>;
        }
        const data = headingsData[0];
        return (
          <Mutation
            resourceName="headingsData"
            url={`/headingsData/${data.id}`}
            schema={headingSchema}
            post={closePanel}
            render={({ update, loading: pending }) => {
              if (pending) {
                return <div>updating...</div>;
              }
              return (
                <LandingPageForm onSubmit={update} initialValues={data} onCancel={closePanel} />
              );
            }}
          />
        );
      }}
    />
  );
}

LandingPageEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      consentTypeId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
