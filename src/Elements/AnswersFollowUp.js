import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { elementSchema } from './schemas';
import AnswersFollowUpForm from './AnswersFollowUpForm';

const AnswersFollowUp = (props) => {
  const {
    closePanel,
    match: {
      params: { elementId, id },
    },
  } = props;
  const handleSubmit = (update, values, element, answerId) => {
    const answer = element.answers.filter(ans => ans.id === answerId);
    const newAnswer = Object.assign(answer[0], {
      followUp: {
        question: values.get('question'),
      },
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
          url: `/elements/${elementId}`,
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
            url={`/elements/${elementId}`}
            schema={elementSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <AnswersFollowUpForm
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

AnswersFollowUp.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AnswersFollowUp;
