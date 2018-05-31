import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import {
  QueryResource,
  Buttons,
  Heading,
  Breadcrumbs,
  DefinitionList,
  Helpers,
  Table,
} from 'web-components';
import { elementSchema } from './schemas';

const getTableActions = ({ id, elementId, type }) => {
  const actions = [
    {
      content: 'Add image',
      to: { pathname: `/elements/${elementId}/answers/${id}/add-image`, state: { modal: true } },
    },
    {
      content: 'Ontology tagging ',
      to: {
        pathname: `/elements/${elementId}/answers/${id}/ontology-tagging`,
        state: { modal: true },
      },
    },
  ];

  const validationAction = {
    content: 'Add validation',
    to: { pathname: `/elements/${elementId}/answers/${id}/add-validation`, state: { modal: true } },
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

const renderBodyRow = ({ elementId, type }) => ({ id }) => ({
  key: id,
  cells: [Helpers.renderContent('id', id)],
  actions: getTableActions({ elementId, type, id }),
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
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { elementId },
      },
    } = this.props;

    return (
      <div>
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
            if (!elements.length) {
              return <div>No Elements</div>;
            }
            const element = elements[0];
            return (
              <div>
                <Breadcrumbs
                  sections={[
                    { content: 'Elements', to: '/elements' },
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
                            pathname: `/elements/${elementId}/edit`,
                            state: { modal: true },
                          },
                        },
                        {
                          content: 'Edit Logic',
                          to: {
                            pathname: `/elements/${elementId}/edit-logic`,
                            state: { modal: true },
                          },
                        },
                        {
                          content: 'Add Image',
                          to: {
                            pathname: `/elements/${elementId}/add-image`,
                            state: { modal: true },
                          },
                        },
                        {
                          content: 'Duplicate',
                          to: {
                            pathname: `/elements/${elementId}/duplicate`,
                            state: { modal: true },
                          },
                        },
                        {
                          content: 'Delete',
                          to: {
                            pathname: `/elements/${elementId}/delete`,
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
                      renderBodyRow={renderBodyRow({ elementId, type: element.type })}
                      tableData={element.answers}
                    />
                  </Grid.Column>
                </Grid>
              </div>
            );
          }}
        </QueryResource>
      </div>
    );
  }
}

export default ElementsShow;
