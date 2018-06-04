import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, QueryResource } from 'web-components';
import QuestionnaireElementReOrderForm from './QuestionnaireElementReOrderForm';
import { versionSchema } from './schemas';

const QuestionnaireElementReOrder = (props) => {
  const {
    closePanel,
    match: {
      params: { currentVersionId, elementid },
    },
  } = props;
  const handleSubmit = (update, version, elementId, values) => {
    const currentIndex = version.body.map(element => element.id).indexOf(elementid);
    const newIndex = values.get('index');
    const newElements = version.body;
    // Swap element in array
    const temp = newElements[currentIndex];
    newElements[currentIndex] = newElements[newIndex];
    newElements[newIndex] = temp;

    const newVersion = Object.assign(version, {
      body: newElements,
    });

    update(newVersion);
  };
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'versions',
          url: `/versions/${currentVersionId}`,
          schema: versionSchema,
          filter: { id: currentVersionId },
        },
      ]}
    >
      {({ versions }) => {
        const version = versions[0];
        return (
          <Mutation
            resourceName="versions"
            url={`/versions/${currentVersionId}`}
            schema={versionSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <QuestionnaireElementReOrderForm
                  form={`questions-order-${currentVersionId}`}
                  onSubmit={value => handleSubmit(update, version, elementid, value)}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
  );
};
QuestionnaireElementReOrder.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnaireElementReOrder;
