import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Query, Resource, Buttons, Heading, Breadcrumbs, DefinitionList } from 'web-components';
import { exampleSchema } from './schemas';

class ExamplesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        exampleId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const { match: { params: { exampleId } } } = this.props;

    return (
      <div>
        <Query
          resourceName="examples"
          url={`/examples/${exampleId}`}
          schema={exampleSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName="examples"
              filter={{ id: exampleId }}
              render={({ examples }) => {
                if (loading && !examples.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                const example = examples[0];
                const { id, age, category, title, timestamp } = example;
                return (
                  <div>
                    <Grid>
                      <Grid.Column width={12}>
                        <Breadcrumbs
                          sections={[
                            { content: 'Examples', to: '/examples' },
                            { content: example.title },
                          ]}
                        />
                        <Heading size="h1" subtitle="Created by Craig McNamara">
                          {example.title}
                        </Heading>
                        <DefinitionList
                          contents={[
                            {
                              header: 'ID',
                              content: id,
                            },
                            {
                              header: 'Title',
                              content: title,
                            },
                            {
                              header: 'Age',
                              content: age,
                            },
                            {
                              header: 'Category',
                              content: category,
                            },
                            {
                              header: 'Date',
                              content: timestamp,
                            },
                          ]}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            { content: 'Edit', to: `/examples/${exampleId}/edit` },
                            {
                              content: 'Delete',
                              to: `/examples/${exampleId}/delete`,
                            },
                          ]}
                        />
                      </Grid.Column>
                    </Grid>
                  </div>
                );
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default ExamplesShow;
