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

  /**
   * Mark a Todo as done
   *
   * Notes:
   * - toggleDone does not refresh even after a load
   *
   * @param id
   */
  const handleToggleDone = async (id: string) => {
    try {
      // We return the toggle Todo, but we don't update the view
      await apiClient.toggleDone(id);

      // Don't duplicate the todo item
      const updatedTodos = todos.map((todo) => {
        // If the todo has the same ID as the toggled ID,
        // update that todo
        if (todo.id === id) {
          // Use the spread operator to create a new object
          // Toggle `done` property on the todo
          return { ...todo, done: !todo.done };
        }

        return todo;
      });

      // Update view for toggleDone
      setTodos(updatedTodos);
    } catch (error) {
      // TODO: In the future, add an notification for the client
      // about the error
      console.error('Could not complete Todo: ', error);
    }
  };

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
          <button onClick={() => handleToggleDone(todo.id)}>
            Mark {todo.done ? 'Undone' : 'Done'}
          </button>
        </div>
      ))}
    </>
  );
}

export default App;
