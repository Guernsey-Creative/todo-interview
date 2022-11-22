import { useEffect, useState } from 'react';
import { ApiClient, ToDo } from './ApiClient';
import './App.css';

const apiClient = new ApiClient(false);

function App() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [label, setLabel] = useState('');

  /**
   * Fetch the latest Todos from the API.
   *
   * Add in separate function, in case we need to call
   * it in another function. This will probably be overkill,
   * but we'll see :)
   */
  const fetchLatestTodos = () => {
    apiClient
      .getToDos()
      .then((fetchedTodos) => setTodos(fetchedTodos))
      .catch(console.error);
  };

  // We fetch once, but don't update the view after
  // an event has been called, i.e. `addTodo`, `toggleDone`
  useEffect(() => {
    fetchLatestTodos();
  }, []);

  const handleFetchTodo = async (label: string) => {
    try {
      // Add additional todos through the API
      const newTodo = await apiClient.addTodo(label);

      // Update view for addTodo
      // View updates after a load, so we need to update the view
      // after successfully adding a Todo through the API
      setTodos([...todos, newTodo]);

      // Reset the input on successful update
      setLabel('');

      // TODO (consider):
      // - Maybe refocus on input after adding a todo
      // - Or target the new todo if it has any additional actions
    } catch (error) {
      // TODO: In the future, add an notification for the client
      // about the error
      console.error('Could not save new Todo: ', error);
    }
  };

  // Update view for toggleDone
  // toggleDone does not refresh even after a load

  return (
    <>
      <h1>To Do List</h1>

      <div className="add-todo-container">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Buy groceries"
        />
        <button onClick={() => handleFetchTodo(label)}>Add ToDo</button>
      </div>

      {todos.map((todo) => (
        <div key={todo.id} className="todo-item">
          <label
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.label}
          </label>
          <button onClick={() => apiClient.toggleDone(todo.label)}>
            Mark {todo.done ? 'Undone' : 'Done'}
          </button>
        </div>
      ))}
    </>
  );
}

export default App;
