import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { elementSchema } from './schemas';
import ElementsAddImageForm from './ElementsAddImageForm';

const AnswersAddImage = (props) => {
  const {
    closePanel,
    match: {
      params: { questionnaireId, elementId, id },
    },
  } = props;
  const handleSubmit = (update, values, element, answerId) => {
    const answer = element.answers.filter(ans => ans.id === answerId);
    const newAnswer = Object.assign(answer[0], {
      image: `${process.env.REACT_APP_BASE_URL}/download?id=${values.get('file').id}`,
    });

    const newElementAnswers = element.answers.map((ans) => {
      if (answerId === ans.id) {
        return newAnswer;
      }
      return ans;
    });

    update({
      ...element,
      answers: newElementAnswers,
    });
  };
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'elements',
          url: `/questionnaires/${questionnaireId}/elements/${elementId}`,
          schema: elementSchema,
          filter: { id: elementId },
        },
      ]}
    >
      {({ elements }) => {
        const element = elements[0];
        return (
          <Mutation
            resourceName="elements"
            url={`/questionnaires/${questionnaireId}/elements/${elementId}`}
            schema={elementSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <ElementsAddImageForm
                  onSubmit={values => handleSubmit(update, values, element, id)}
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

AnswersAddImage.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AnswersAddImage;
