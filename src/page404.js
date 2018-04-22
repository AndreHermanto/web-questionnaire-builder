import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 400%;
  color: grey;
`;

const Content = styled.div`
  font-size: 150%;
  color: grey;
  padding-bottom: 3%;
`;

const Page404 = () => (
  <Container>
    <Heading>404</Heading>
    <Content>
      <Icon name="frown" />Oops! We can't seem to find the page you're looking for.
    </Content>
    <Link to={'/'}>
      <Button>Back to Home</Button>
    </Link>
  </Container>
);

export default Page404;
