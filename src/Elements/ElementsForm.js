import React from 'react';
import PropTypes from 'prop-types';
import { Form, Divider } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Helpers } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import cuid from 'cuid';
import { connect } from 'react-redux';
import Uomfields from './Fields/Uomfields';
import OntologyFields from './Fields/OntologyFields';

const getDefaultAnswer = (type) => {
  switch (type) {
    case 'matrix':
    case 'radio':
    case 'checkbox':
    case 'weight':
    case 'height':
    case 'date':
    case 'number':
      return {
        id: cuid(),
        text: '',
        concepts: [],
      };
    case 'text':
      return {
        id: cuid(),
        text: '',
        concepts: [],
      };
    case 'uom':
      return {
        id: cuid(),
        uom1: {},
        concepts: [],
      };
    case 'uoms':
      return {
        id: cuid(),
        uom1: {},
        uom2: {},
        concepts: [],
      };
    case 'autoComplete':
      return {
        id: cuid(),
        datasource: '',
        concepts: [],
      };
    default:
      return null;
  }
};
const getAnswers = (type) => {
  const answers = fromJS([getDefaultAnswer(type)] || []);
  return answers;
};

const showAnswers = type => type === 'radio' || type === 'checkbox' || type === 'matrix';
const requiredOptions = [
  { key: 'YES', value: true, text: 'Yes' },
  { key: 'NO', value: false, text: 'No' },
];

let ElementsForm = ({ handleSubmit, onCancel, type, questionOptions, change }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Elements</Heading>
    <Fields.TextArea name="question" required />
    <Fields.Radio name="required" options={requiredOptions} required />
    <Fields.Select
      name="type"
      options={[
        'radio',
        'checkbox',
        'text',
        'weight',
        'height',
        'date',
        'number',
        'matrix',
        'uom',
        'uoms',
        'autoComplete',
      ].map((value) => {
        if (value === 'text') {
          return {
            key: value,
            value,
            text: Helpers.renderLabel('questionType.text'),
          };
        }
        return {
          key: value,
          value,
          text: Helpers.renderLabel(value),
        };
      })}
      required
      onChange={(event, newValue) => {
        change('answers', getAnswers(newValue));
      }}
    />
    {showAnswers(type) && (
      <Fields.Array
        name="answers"
        header="Answers"
        defaultAddedValue={() => {
          const answer = getDefaultAnswer(type);
          return answer;
        }}
        components={<Fields.Text name="text" label="Text" required />}
      />
    )}

    {type === 'text' && (
      <Fields.Radio
        name="singleLine"
        label="Single Line Only"
        options={[false, true].map(value => ({
          key: value,
          value,
          text: Helpers.renderContent('singleLine', value),
        }))}
      />
    )}

    {type === 'uom' && (
      <Uomfields name="answers.0.uom1" change={change} label="Unit of Measurement 1" />
    )}
    {type === 'uoms' && (
      <div>
        <Uomfields name="answers.0.uom1" change={change} label="Unit of Measurement 1" />
        <Uomfields name="answers.0.uom2" change={change} label="Unit of Measurement 2" />
      </div>
    )}
    {type === 'autoComplete' && <OntologyFields required name="answers.0.datasource" />}
    {questionOptions.length > 0 && (
      <div>
        <Divider />
        <Heading as="h3">Placement</Heading>
        <Fields.Radio
          name="position"
          label="Position"
          options={[
            { key: 'AFTER', text: 'After', value: 1 },
            { key: 'BEFORE', text: 'Before', value: 0 },
          ]}
          required
        />
        <Fields.Select name="index" label="Question" options={questionOptions} required />
      </div>
    )}
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
ElementsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  type: PropTypes.string,
  questionOptions: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};

ElementsForm.defaultProps = {
  type: null,
};

ElementsForm = connect((state) => {
  const selector = formValueSelector('elements-form');
  const type = selector(state, 'type');
  return {
    type,
  };
})(ElementsForm);

export default reduxForm({
  enableReinitialize: true,
})(ElementsForm);
