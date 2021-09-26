import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Routines from './Routines';
import Home from './Home';
import { withAuthenticator } from '@aws-amplify/ui-react'

function App() {
  return (
    <BrowserRouter>
      <Navbar>
        <Container>
          <Nav>
            <Nav.Link href="/">MAIN VIEW</Nav.Link>
            <Nav.Link href="/routines">ROUTINES</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Switch>
        <Route path="/routines"><Routines /></Route>
        <Route path="/"><Home /></Route>
      </Switch>
    </BrowserRouter>
  )
}
  
export default withAuthenticator(App);
