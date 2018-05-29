import React from 'react';
import PropTypes from 'prop-types';
import { Resource, Mutation, Query } from 'web-components';
import { answerSchema, elementSchema } from './schemas';
import ElementsAddImageForm from './ElementsAddImageForm';

const ElementsAddImage = (props) => {
  const {
    closePanel,
    match: {
      params: { elementId },
    },
  } = props;
  const handleSubmit = (update, values, element, answer) => {
    const newAnswer = Object.assign(answer, {
      image: `${process.env.REACT_APP_BASE_URL}/download?id=${values.get('file').id}`,
    });

    const newElementAnswers = element.answers.map((ans) => {
      if (answer.id === ans.id) {
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
    <Query
      resourceName="elements"
      url={`/elements/${elementId}`}
      schema={elementSchema}
      render={() => (
        <Resource
          resources={[
            {
              resourceName: 'elements',
              schema: elementSchema,
            },
            {
              resourceName: 'answers',
              schema: answerSchema,
            },
          ]}
          render={({ elements, answers }) => {
            const element = elements[0];
            const answer = answers[0];
            return (
              <Mutation
                resourceName="elements"
                url={`/elements/${elementId}`}
                schema={elementSchema}
                post={closePanel}
                render={({ update, loading: updateLoading }) => {
                  if (updateLoading) {
                    return <div>loading...</div>;
                  }
                  return (
                    <ElementsAddImageForm
                      onSubmit={values => handleSubmit(update, values, element, answer)}
                      onCancel={closePanel}
                    />
                  );
                }}
              />
            );
          }}
        />
      )}
    />
  );
};

ElementsAddImage.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsAddImage;
