import { API } from 'aws-amplify';
import { listRoutines } from './graphql/queries';
import { createTodo, updateRoutine } from './graphql/mutations';

export default async function createRoutineTodos() {
  const now = new Date();
  const today = new Date().toISOString().substring(0, 10);
  const hours = now.getHours();
  const hoursStr = (hours < 10 ? '0' : '') + hours;
  const minutes = now.getMinutes();
  const minutesStr = (minutes < 10 ? '0' : '') + minutes;
  const currentTimeStr = hoursStr + minutesStr;
  const apiData = await API.graphql({ query: listRoutines });
  const routines = apiData.data.listRoutines.items
  console.log(routines)
  for (const routine of routines) {
    if (currentTimeStr > routine.earliestTime 
      && routine.todoCreatedOn !== today) {
        console.log(routine.name)
        console.log(routine.todoCreatedOn)
        const newTodo = {
          name: routine.name,
          description: routine.description,
          tag: ["routine"],
          done: false
        }
        await API.graphql({
          query: createTodo, 
          variables: { input: newTodo } 
        });
        const updatedRoutine = {
          id: routine.id,
          name: routine.name,
          description: routine.description,
          earliestTime: routine.earliestTime,
          todoCreatedOn: today
        }
        await API.graphql({
          query: updateRoutine, 
          variables: { input: updatedRoutine } 
        });
    }
  }
  console.log('created routine todos')
}
