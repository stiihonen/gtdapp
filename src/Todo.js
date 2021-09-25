import { React } from 'react';

function Todo(props) {
  async function handleToggleDone(event) {
    props.onToggleDone(props.todo)
  }

  async function handleDelete(event) {
    props.onDelete(props.todo)
  }

  return (
    <div>
      <h4><input type="checkbox" checked={props.todo.done} onChange={handleToggleDone}/> {props.todo.name}</h4>
      <p>{props.todo.description}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

export default Todo;
