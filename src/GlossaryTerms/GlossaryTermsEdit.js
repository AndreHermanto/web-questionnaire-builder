import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { glossaryTermSchema } from './schemas';
import GlossaryTermsForm from './GlossaryTermsForm';
/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
export default function GlossaryTermsEdit({
  closePanel,
  match: {
    params: { glossaryTermId },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'glossaryTerms',
          url: `/glossary-terms/${glossaryTermId}`,
          schema: glossaryTermSchema,
          filter: { id: glossaryTermId },
        },
      ]}
      render={({ glossaryTerms }) => {
        const glossaryTerm = glossaryTerms[0];
        return (
          <Mutation
            resourceName="glossaryTerms"
            url={`/glossary-terms/${glossaryTermId}`}
            schema={glossaryTermSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }

              return (
                <GlossaryTermsForm
                  onSubmit={update}
                  onCancel={closePanel}
                  initialValues={glossaryTerm}
                />
              );
            }}
          />
        );
      }}
    />
  );
}

GlossaryTermsEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      glossaryTermId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
