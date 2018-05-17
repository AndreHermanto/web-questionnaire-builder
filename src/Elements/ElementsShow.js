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
} from 'web-components';
import { elementSchema } from './schemas';

const renderProperty = (propertyName, value, element) => {
  switch (propertyName) {
    case 'id':
      return null;
    case 'answers':
      if (value[0].type !== 'text') {
        return {
          label: Helpers.renderLabel(propertyName),
          value: Helpers.renderContent(propertyName, value, element),
        };
      }
      return null;

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
                <Heading size="h1">{element.title}</Heading>
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
                          content: 'Delete',
                          to: `/elements/${elementId}/delete`,
                        },
                      ]}
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
