import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Buttons, Heading, Breadcrumbs, DefinitionList, Helpers, Table } from 'web-components';

const isQuestion = type => !(type === 'section' || type === 'start' || type === 'end');

const getTableActions = ({ id, elementId, type, questionnaireId, validationLogic }) => {
  const actions = [
    {
      content: 'Add image',
      to: {
        pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/add-image`,
        state: { modal: true },
      },
    },
    {
      content: 'Follow up question',
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
    ...((type === 'checkbox' || type === 'radio') && [
      {
        content: 'Add trait data',
        to: {
          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/trait`,
          state: { modal: true },
        },
      },
    ]),
    {
      content: 'Add glossary annotation',
      to: {
        pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/glossary-terms/create`,
        state: { modal: true },
      },
    },
    ...(['number', 'text', 'uom', 'uoms'].includes(type) && [
      {
        content: 'Add validation',
        to: {
          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/add-validation`,
          state: { modal: true },
        },
      },
    ]),
    ...(validationLogic !== undefined && [
      {
        content: 'Delete validation',
        to: {
          pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/answers/${id}/delete-validation`,
          state: { modal: true },
        },
      },
    ]),
  ];

  return actions;
};

const headerRow = [
  {
    propName: 'text',
  },
  {
    propName: 'type',
  },
  {
    propName: 'image',
  },
  {
    propName: 'traitData',
  },
  {
    propName: 'concepts',
  },
  {
    propName: 'followUp',
  },
];

const renderBodyRow = ({ elementId, type, questionnaireId }) => ({
  id,
  text,
  validationLogic,
}) => ({
  key: id,
  cells: [Helpers.renderContent('text', text), Helpers.renderContent('type', type)],
  actions: getTableActions({ elementId, type, id, questionnaireId, validationLogic }),
});

const renderProperty = (propertyName, value, element) => {
  switch (propertyName) {
    case 'id':
    case 'answers':
    case 'internalId':
    case 'baseQuestionId':
    case 'color':
    case 'buttonText':
    case 'fontSize':
    case 'isBold':
    case 'isColor':
    case 'isItalic':
    case 'closed':
    case 'displayLogic':
    case 'position':
    case 'index':
      return null;
    case 'matrix':
      if (element.type !== 'matrix') {
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

class ElementsShowQuestionPage extends React.Component {
  static propTypes = {
    element: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    questionnaireId: PropTypes.string.isRequired,
    elementId: PropTypes.string.isRequired,
    questionnaire: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  };
  render() {
    const { questionnaireId, questionnaire, element, elementId } = this.props;

    return (
      <div>
        <Breadcrumbs
          sections={[
            { content: 'Questionnaires', to: '/questionnaires' },
            {
              content: questionnaire.currentTitle,
              to: `/questionnaires/${questionnaireId}`,
            },
            { content: element.question || element.title || element.text },
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
                  content: 'Edit visibility logic',
                  to: {
                    pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/edit-logic`,
                    state: { modal: true },
                  },
                },
                ...(element.type !== 'section' && [
                  {
                    content: 'Add image',
                    to: {
                      pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/add-image`,
                      state: { modal: true },
                    },
                  },
                  {
                    content: 'Add validated source',
                    to: {
                      pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/add-source`,
                      state: { modal: true },
                    },
                  },
                  {
                    content: 'Add trait',
                    to: {
                      pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/trait`,
                      state: { modal: true },
                    },
                  },
                ]),
                {
                  content: 'Add glossary annotation',
                  to: {
                    pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/glossary-terms/create`,
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
        {isQuestion(element.type) && (
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
        )}
      </div>
    );
  }
}

export default ElementsShowQuestionPage;
