import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Page, NavBar, SideBarComponent, Content, SidePanelRoute } from 'web-components';
import ExamplesList from '../Examples/ExamplesList';
import ExamplesShow from '../Examples/ExamplesShow';
import ExamplesEdit from '../Examples/ExamplesEdit';
import ExamplesCreate from '../Examples/ExamplesCreate';
import ExamplesDelete from '../Examples/ExamplesDelete';

const sidebarGroups = [
  {
    name: '',
    elements: [
      {
        name: 'Examples',
        url: '/examples',
        icon: 'archive',
      },
    ],
  },
  {
    name: 'Settings',
    elements: [
      {
        name: 'User Settings',
        url: '/settings/user',
        icon: 'archive',
      },
      {
        name: 'App Settings',
        url: '/settings/app',
        icon: 'archive',
      },
    ],
  },
];

class Routes extends Component {
  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }
  previousLocation = this.props.location;
  render() {
    const { location } = this.props;
    const isModal = !!(
      (location.state && location.state.modal && this.previousLocation !== location) ||
      this.previousLocation === location
    ); // not initial render

    return (
      <div>
        <Page>
          <div>
            <NavBar
              userName="Craig McNamara"
              onChange={() => {}}
              signOut={() => {}}
              groups={[]}
              apps={[]}
              msgs={[]}
              Notificaitons={[]}
            />
            <SideBarComponent name={'Examples'} groups={sidebarGroups} />
            {/* Regular Content */}
            <Content>
              <Switch location={isModal ? this.previousLocation : location}>
                <Redirect exact from="/" to="/examples" />
                <Route path="/examples/create" component={ExamplesList} />
                <Route path="/examples/:exampleId" component={ExamplesShow} />
                <Route path="/examples" component={ExamplesList} />
              </Switch>
            </Content>
          </div>
        </Page>
        {/* Side Panel Content Here */}
        <Switch>
          <SidePanelRoute path="/examples/create" component={ExamplesCreate} />
          <SidePanelRoute path="/examples/:exampleId/edit" component={ExamplesEdit} />
          <SidePanelRoute path="/examples/:exampleId/delete" component={ExamplesDelete} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
