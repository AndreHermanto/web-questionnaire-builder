import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Buttons, Heading, Breadcrumbs, DefinitionList, Helpers, Table } from 'web-components';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';

const getTableActions = ({ id, elementId, type, questionnaireId }) => {
  const actions = [
    {
      content: 'Add image',
      to: {
        pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/add-image`,
        state: { modal: true },
      },
    },
    {
      content: 'Follow Up Question',
      to: {
        pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/follow-up`,
        state: { modal: true },
      },
    },
    {
      content: 'Ontology tagging ',
      to: {
        pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/ontology-tagging`,
        state: { modal: true },
      },
    },
  ];

  const validationAction = {
    content: 'Add validation',
    to: {
      pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/add-validation`,
      state: { modal: true },
    },
  };

  if (type === 'number' || type === 'text') actions.push(validationAction);

  return actions;
};

const headerRow = [
  {
    propName: 'id',
  },
  {
    propName: 'text',
  },
  {
    propName: 'image',
  },
];

const renderBodyRow = ({ elementId, type, questionnaireId }) => ({ id }) => ({
  key: id,
  cells: [Helpers.renderContent('id', id)],
  actions: getTableActions({ elementId, type, id, questionnaireId }),
});

const renderProperty = (propertyName, value, element) => {
  switch (propertyName) {
    case 'id':
      return null;
    case 'answers':
      if (element.type === 'textinformation') {
        return null;
      }
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value, element),
      };
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value, element),
      };
  }
};

class ElementsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        elementId: PropTypes.string.isRequired,
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { elementId, questionnaireId },
      },
    } = this.props;

    return (
      <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
        {({ questionnaires, elements }) => {
          if (!elements.length) {
            return <div>No Elements</div>;
          }
          const element = elements[0];
          return (
            <div>
              <Breadcrumbs
                sections={[
                  { content: 'Questionnaires', to: '/questionnaires' },
                  {
                    content: questionnaires[0].currentTitle,
                    to: `/questionnaires/${questionnaireId}`,
                  },
                  { content: element.question },
                ]}
              />
              <Heading size="h1">{element.question}</Heading>
              <Grid>
                <Grid.Column width={12}>
                  <DefinitionList listData={element} renderProperty={renderProperty} />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Buttons
                    actions={[
                      {
                        content: 'Edit',
                        to: {
                          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/edit`,
                          state: { modal: true },
                        },
                      },
                      {
                        content: 'Edit Logic',
                        to: {
                          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/edit-logic`,
                          state: { modal: true },
                        },
                      },
                      {
                        content: 'Add Image',
                        to: {
                          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/add-image`,
                          state: { modal: true },
                        },
                      },
                      {
                        content: 'Duplicate',
                        to: {
                          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/duplicate`,
                          state: { modal: true },
                        },
                      },
                      {
                        content: 'Delete',
                        to: {
                          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/delete`,
                          state: { modal: true },
                        },
                      },
                    ]}
                  />
                </Grid.Column>
              </Grid>
              <Grid>
                <Grid.Column width={12}>
                  <Table
                    headerRow={headerRow}
                    renderBodyRow={renderBodyRow({
                      elementId,
                      type: element.type,
                      questionnaireId,
                    })}
                    tableData={element.answers}
                  />
                </Grid.Column>
              </Grid>
            </div>
          );
        }}
      </QuestionnaireQueryResource>
    );
  }
}

export default ElementsShow;
