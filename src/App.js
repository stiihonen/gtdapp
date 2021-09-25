import React, { useState, useEffect } from 'react';
import { CardGroup, Card, Nav, ListGroup, Badge } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { listTodos } from './graphql/queries';
import { createTodo, deleteTodo, updateTodo } from './graphql/mutations';
import Todo from './Todo';

const initialFormState = { name: '', description: '' }

function App() {
  const [todos, setTodos] = useState([]);
  const [projectsFormData, setProjectsFormData] = useState(initialFormState);
  const [callsFormData, setCallsFormData] = useState(initialFormState);
  const [actionsFormData, setActionsFormData] = useState(initialFormState);
  const [errandsFormData, setErrandsFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    setTodos(apiData.data.listTodos.items);
  }

  async function createProject() {
    if (!projectsFormData.name) return;
    projectsFormData.tag = [ "project" ];
    await API.graphql({ query: createTodo, variables: { input: projectsFormData } });
    setTodos([ ...todos, projectsFormData ]);
    setProjectsFormData(initialFormState);
  }

  async function createCall() {
    if (!callsFormData.name || !callsFormData.description) return;
    callsFormData.tag = [ "call" ];
    await API.graphql({ query: createTodo, variables: { input: callsFormData } });
    setTodos([ ...todos, callsFormData ]);
    setCallsFormData(initialFormState);
  }

  async function createAction() {
    if (!actionsFormData.name) return;
    actionsFormData.tag = [ "action" ];
    await API.graphql({ query: createTodo, variables: { input: actionsFormData } });
    setTodos([ ...todos, actionsFormData ]);
    setActionsFormData(initialFormState);
  }

  async function createErrand() {
    if (!errandsFormData.name) return;
    errandsFormData.tag = [ "errand" ];
    await API.graphql({ query: createTodo, variables: { input: errandsFormData } });
    setTodos([ ...todos, errandsFormData ]);
    setErrandsFormData(initialFormState);
  }

  async function toggleDone({ id }) {
    let newTodo;
    const newTodosArray = todos.map(todo => {
      if (todo.id === id) {
        const oldValue = todo?.done;
        newTodo = Object.assign({}, todo, { done: !oldValue });
        return newTodo;
      }
      return todo;
    })
    setTodos(newTodosArray);
    await API.graphql({ query: updateTodo, variables: { input: newTodo }});
  }

  async function onDeleteTodo({ id }) {
    const newTodosArray = todos.filter(todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodo, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>MAIN VIEW</h1>
      <CardGroup>
        <Card><Card.Header>PROJECTS</Card.Header>
        <Card.Body className="text-start">
        <input
            onChange={e => setProjectsFormData({ ...projectsFormData, 'name': e.target.value})}
            placeholder="Project"
            value={projectsFormData.name}
          />
          <input
            onChange={e => setCallsFormData({ ...projectsFormData, 'description': e.target.value})}
            placeholder="Project notes"
            value={projectsFormData.description}
          />
          <button onClick={createProject}>Create Project</button>
          <ListGroup>
            {
              todos.filter(todo => todo.tag.includes("project")).map(todo => (
                <ListGroup.Item key={todo.id || todo.name}>
                  <Todo todo={todo} onToggleDone={toggleDone} onDelete={onDeleteTodo} />
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </Card.Body>
        </Card>
        <Card><Card.Header>
          <Nav variant="tabs" defaultActiveKey="#nextActions">
            <Nav.Item><Nav.Link href="#nextActions">NEXT ACTIONS</Nav.Link></Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item><Nav.Link href="#waitingFors">WAITING FOR's...</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body className="text-start">
        <ListGroup>
          <ListGroup.Item>
          <h3><Badge>CALLS</Badge></h3>
          <input
            onChange={e => setCallsFormData({ ...callsFormData, 'name': e.target.value})}
            placeholder="Who to call?"
            value={callsFormData.name}
          />
          <input
            onChange={e => setCallsFormData({ ...callsFormData, 'description': e.target.value})}
            placeholder="Notes for the call"
            value={callsFormData.description}
          />
          <button onClick={createCall}>Create Call</button>
          <ListGroup>
            {
              todos.filter(todo => todo.tag.includes("call")).map(todo => (
                <ListGroup.Item key={todo.id || todo.name}>
                  <Todo todo={todo} onToggleDone={toggleDone} onDelete={onDeleteTodo} />
                </ListGroup.Item>
              ))
            }
          </ListGroup>
          </ListGroup.Item>
          <ListGroup.Item>
          <h3><Badge>OTHER</Badge></h3>
          <input
            onChange={e => setActionsFormData({ ...actionsFormData, 'name': e.target.value})}
            placeholder="Next action"
            value={actionsFormData.name}
          />
          <input
            onChange={e => setActionsFormData({ ...actionsFormData, 'description': e.target.value})}
            placeholder="Notes for the next action"
            value={actionsFormData.description}
          />
          <button onClick={createAction}>Create Next Action</button>
          <ListGroup>
            {
              todos.filter(todo => todo.tag.includes("action")).map(todo => (
                <ListGroup.Item key={todo.id || todo.name}>
                  <Todo todo={todo} onToggleDone={toggleDone} onDelete={onDeleteTodo} />
                </ListGroup.Item>
              ))
            }
          </ListGroup>
          </ListGroup.Item>        
          <ListGroup.Item>
          <h3><Badge>ERRANDS</Badge></h3>
          <input
            onChange={e => setErrandsFormData({ ...errandsFormData, 'name': e.target.value})}
            placeholder="Errand"
            value={errandsFormData.name}
          />
          <input
            onChange={e => setErrandsFormData({ ...errandsFormData, 'description': e.target.value})}
            placeholder="Notes for the errand"
            value={errandsFormData.description}
          />
          <button onClick={createErrand}>Create Errand</button>
          <ListGroup>
            {
              todos.filter(todo => todo.tag.includes("errand")).map(todo => (
                <ListGroup.Item key={todo.id || todo.name}>
                  <Todo todo={todo} onToggleDone={toggleDone} onDelete={onDeleteTodo} />
                </ListGroup.Item>
              ))
            }
          </ListGroup>
          </ListGroup.Item>        
        </ListGroup>
        </Card.Body>
        </Card>
        <Card><Card.Header>
          <Nav variant="tabs" defaultActiveKey="#today">
            <Nav.Item><Nav.Link href="#today">ONLY ON {new Date().toISOString().substring(0, 10)}</Nav.Link></Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item><Nav.Link href="#waitingFors">WEEK</Nav.Link></Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item><Nav.Link href="#waitingFors">MONTH</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header></Card>
      </CardGroup>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
