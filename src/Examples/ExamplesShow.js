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
import { exampleSchema } from './schemas';

const renderProperty = (propertyName, value, example) => {
  switch (propertyName) {
    case 'id':
      return null;
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value, example),
      };
  }
};

class ExamplesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        exampleId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { exampleId },
      },
    } = this.props;

    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'examples',
              url: `/examples/${exampleId}`,
              schema: exampleSchema,
              filter: { id: exampleId },
            },
          ]}
        >
          {({ examples }) => {
            if (!examples.length) {
              return <div>No examples</div>;
            }
            const example = examples[0];
            return (
              <div>
                <Breadcrumbs
                  sections={[{ content: 'Examples', to: '/examples' }, { content: example.title }]}
                />
                <Heading size="h1">{example.title}</Heading>
                <Grid>
                  <Grid.Column width={12}>
                    <DefinitionList listData={example} renderProperty={renderProperty} />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Buttons
                      actions={[
                        {
                          content: 'Edit',
                          to: { pathname: `/examples/${exampleId}/edit`, state: { modal: true } },
                          'data-test': 'edit-example-button',
                        },
                        {
                          content: 'Delete',
                          to: { pathname: `/examples/${exampleId}/delete`, state: { modal: true } },
                          'data-test': 'delete-example-button',
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

export default ExamplesShow;
