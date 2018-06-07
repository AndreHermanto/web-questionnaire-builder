import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import get from 'lodash.get';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const getAnswersByQuestionId = (questionId, questions) =>
  get(questions.find(question => question.id === questionId), 'answers', []);

const filterQuestionsByType = questions =>
  questions.filter(
    question =>
      !(question.type === 'section' || question.type === 'start' || question.type === 'end'),
  );

const isEmptyArr = arr => arr.length === 0;

let ElementsLogicForm = ({
  handleSubmit,
  onCancel,
  selectedQuestion,
  selectedAnswer,
  exsitingLogic,
  questions,
  change,
}) => {
  const questionOptions = filterQuestionsByType(questions);
  const answerOptions = selectedQuestion && getAnswersByQuestionId(selectedQuestion.id, questions);
  return (
    <Form onSubmit={handleSubmit}>
      <Heading size="h1">Logic</Heading>
      {!isEmptyArr(questions) && (
        <Fields.Select
          name="question"
          label="Questions"
          options={questionOptions.map(value => ({
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
      <Heading size="h3">
        {
          'Syntax: { question text - answer text / questionId answerId} (&&: AND, ||: OR) You can wrap any date question with age() to calculate the number of years between the date, and now'
        }
      </Heading>
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

ElementsLogicForm.propTypes = {
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

ElementsLogicForm.defaultProps = {
  exsitingLogic: '',
  selectedQuestion: '',
  selectedAnswer: '',
  questions: [],
};

ElementsLogicForm = connect((state) => {
  const selector = formValueSelector('element-logic-edit');
  const selectedQuestion = selector(state, 'question');
  const selectedAnswer = selector(state, 'answer');
  const exsitingLogic = selector(state, 'logic');
  return {
    selectedQuestion,
    selectedAnswer,
    exsitingLogic,
  };
})(ElementsLogicForm);

export default reduxForm({
  enableReinitialize: true,
})(ElementsLogicForm);
