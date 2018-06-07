import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import get from 'lodash.get';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const getAnswersByQuestionId = (questionId, questions) =>
  get(questions.find(question => question.id === questionId), 'answers', []);

const isEmptyArr = arr => arr.length === 0;

let ElementsSectionForm = ({
  handleSubmit,
  onCancel,
  selectedQuestion,
  selectedAnswer,
  exsitingLogic,
  questions,
  change,
}) => {
  const answerOptions = selectedQuestion && getAnswersByQuestionId(selectedQuestion.id, questions);
  return (
    <Form onSubmit={handleSubmit}>
      <Heading size="h1">Sections</Heading>
      <Heading size="h3">Remember: All headings must be uniquely named.</Heading>
      <Fields.Text name="title" required />
      <Fields.Radio
        name="size"
        label="Heading Size"
        options={['1', '2', '3'].map(value => ({
          key: value,
          value,
          text: `Heading ${value}`,
        }))}
      />

      <Heading size="h3">New logic</Heading>
      {!isEmptyArr(questions) && (
        <Fields.Select
          name="question"
          label="Questions"
          options={questions.map(value => ({
            key: value.id,
            value,
            text: value.question,
          }))}
        />
      )}
      {!isEmptyArr(answerOptions) && (
        <Fields.Select
          name="answer"
          label="Answers"
          options={answerOptions.map(value => ({
            key: value.id,
            value,
            text: value.text,
          }))}
        />
      )}
      {selectedQuestion &&
        selectedAnswer && (
        <Button
          onClick={() => {
            const logic = `${exsitingLogic} {${selectedQuestion.question} - ${
              selectedAnswer.text
            } / ${selectedQuestion.id} ${selectedAnswer.id}}`;
            change('logic', logic);
            change('question', '');
            change('answer', '');
          }}
        >
            Add logic{' '}
        </Button>
      )}
      <Fields.TextArea name="logic" />

      <Buttons
        actions={[
          {
            content: 'Save',
            type: 'submit',
          },
          {
            content: 'Cancel',
            onClick: onCancel,
            type: 'button',
          },
        ]}
      />
    </Form>
  );
};
ElementsSectionForm.propTypes = {
  selectedQuestion: PropTypes.shape({
    id: PropTypes.string,
  }),
  selectedAnswer: PropTypes.shape({
    id: PropTypes.string,
  }),
  exsitingLogic: PropTypes.string,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  change: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

ElementsSectionForm.defaultProps = {
  exsitingLogic: '',
  selectedQuestion: '',
  selectedAnswer: '',
  questions: [],
};

ElementsSectionForm = connect((state) => {
  const selector = formValueSelector('elements-section-form');
  const selectedQuestion = selector(state, 'question');
  const selectedAnswer = selector(state, 'answer');
  const exsitingLogic = selector(state, 'logic');
  return {
    selectedQuestion,
    selectedAnswer,
    exsitingLogic,
  };
})(ElementsSectionForm);

export default reduxForm({
  enableReinitialize: true,
})(ElementsSectionForm);
