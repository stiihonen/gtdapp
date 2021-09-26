import './App.css';

import React from 'react';
import { API } from 'aws-amplify';
import { createRoutine, deleteRoutine } from './graphql/mutations';
import { listRoutines } from './graphql/queries';
import { Form, Button, ListGroup } from 'react-bootstrap';

export default function Routines() {
  const newRoutine = {
    name: "",
    description: "",
    earliestTime: ""
  }
  const [routines, setRoutines] = React.useState([]);
  const onFormSubmit = async e => {
    e.preventDefault();
    await API.graphql({
      query: createRoutine, 
      variables: { input: newRoutine } 
    });
    setRoutines([ ...routines, newRoutine ]);
  }
  React.useEffect(() => {
    fetchRoutines();
  }, []);
  async function fetchRoutines() {
    const apiData = await API.graphql({ query: listRoutines });
    setRoutines(apiData.data.listRoutines.items);
  }
  const onDelete = async e => {
    const id = e.target.id
    const newRoutinesArray = routines.filter(routine => routine.id !== id);
    setRoutines(newRoutinesArray);
    await API.graphql({ query: deleteRoutine, variables: { input: { id } }});
  }
  return (
    <div className="App">
      <h1>ROUTINES</h1>
      <Form onSubmit={onFormSubmit}>
        <Form.Group controlId="routineName">
          <Form.Control 
            placeholder="Routine" 
            onChange={e => newRoutine.name = e.target.value}
          />
        </Form.Group>
        <Form.Group controlId="routineDescription">
          <Form.Control 
            placeholder="Description" 
            onChange={e => newRoutine.description = e.target.value}
          />
        </Form.Group>
        <Form.Group controlId="routineEarliestTime">
          <Form.Control 
            placeholder="HHMM" 
            onChange={e => newRoutine.earliestTime = e.target.value}
          />
        </Form.Group>
        <Button type="submit">Create Routine</Button>
      </Form>
      <ListGroup>
        {
          routines.sort((firstEl, secondEl) => {
            if (firstEl.earliestTime > secondEl.earliestTime) {
              return 1
            } else if (firstEl.earliestTime < secondEl.earliestTime) {
              return -1
            }
            return 0
          }).map(routine => (
            <ListGroup.Item key={routine.id}>
              <h4>{routine.name} {routine.earliestTime}</h4>
              <p>{routine.description}</p>
              <button id={routine.id} onClick={onDelete}>Delete</button>
            </ListGroup.Item>
          ))
        }
      </ListGroup>
    </div>
  )
}