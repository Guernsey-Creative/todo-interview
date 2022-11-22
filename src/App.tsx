import { useEffect, useState } from 'react';
import { ApiClient, ToDo } from './ApiClient';
import './App.css';
import Button from './components/Button';
import { TodoList } from './components/TodoList';
import { DRAG_AND_DROP_HELP_CONTENT } from './utils/content';

const apiClient = new ApiClient(true);

function App() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [label, setLabel] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  // Depending on how deeply nested and how many components that need
  // the loading states, we may want to move this to a React Context.
  // However, since it's two children deep, it's easier to debug and
  // setup, so keep for now.
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Probably don't need this in the state, but add it here
  // in case we want to update the fetch label.
  const [fetchingLabel, setfetchingLabel] = useState(
    'Retrieving your todo list...'
  );

  /**
   * Fetch the latest Todos from the API.
   *
   * Add in separate function, in case we need to call
   * it in another function. This will probably be overkill,
   * but we'll see :)
   */
  const fetchLatestTodos = () => {
    setIsFetching(true);
    apiClient
      .getToDos()
      .then((fetchedTodos) => setTodos(fetchedTodos))
      .catch(console.error)
      .finally(() => setIsFetching(false)); // toggle off isFetching flag
  };

  // We fetch once, but don't update the view after
  // an event has been called, i.e. `addTodo`, `toggleDone`
  useEffect(() => {
    // Toggle a loading flag for the initial "loading" time
    fetchLatestTodos();
  }, []);

  /**
   * Add a new todo through the API, and refresh the view
   * without making an additional API call.
   *
   * Todo:
   * - Prevent empty string todos from being created
   *
   * Notes:
   * - Maybe refocus on input after adding a todo
   * - Or target the new todo if it has any additional actions
   * @param label - Name of Todo item
   */
  const handleAddTodo = async (label: string) => {
    try {
      // Don't allow empty labels
      if (!label) {
        return;
      }

      // Turn on is updating flag
      setIsAddingTodo(true);

      // Add additional todos through the API
      const newTodo = await apiClient.addTodo(label);

      // Update view for addTodo
      // View updates after a load, so we need to update the view
      // after successfully adding a Todo through the API
      setTodos([...todos, newTodo]);

      // Reset the input on successful update
      setLabel('');
    } catch (error) {
      // TODO: In the future, add an notification for the client
      // about the error
      console.error('Could not save new Todo: ', error);
    } finally {
      // Turn off is updating flag
      setIsAddingTodo(false);
    }
  };

  /**
   * Mark a Todo as done, and refresh the view
   * without making an additional API call.
   *
   * Notes:
   * - toggleDone does not refresh even after a load
   *
   * @param id
   */
  const handleToggleDone = async (id: string) => {
    try {
      // Turn on is updating flag
      setIsUpdating(true);

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
    } finally {
      // Turn off is updating flag
      setIsUpdating(false);
    }
  };

  /**
   * Update the list in the apiClient and state when the
   * drag and drop has been completed.
   */
  const handleListChange = (updatedTodos: ToDo[]) => {
    // Update list in API
    apiClient.saveTodos(updatedTodos);

    // Update parent state
    setTodos(updatedTodos);
  };

  let todoList = (
    <div>
      <p>{fetchingLabel}</p>
    </div>
  );

  if (!isFetching) {
    todoList = (
      <TodoList
        todos={todos}
        loading={isUpdating}
        handleToggleDone={handleToggleDone}
        onListChange={handleListChange}
      />
    );
  }

  const loadingClass = isUpdating ? 'is-disabled' : '';

  return (
    <>
      <h1>To Do List</h1>

      {/* TODO: Add to separate component (TodoInput) if needed in the future */}
      <div className="add-todo-container">
        <div className="add-todo-input">
          <input
            className="todo-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Buy groceries"
            disabled={isUpdating}
          />
          <Button
            classes={`btn-success ${loadingClass}`}
            disabled={isAddingTodo}
            onClick={() => handleAddTodo(label)}
          >
            {isAddingTodo ? 'Saving ToDo' : 'Add ToDo'}
          </Button>
        </div>
        <div className="text-help">
          <small>{DRAG_AND_DROP_HELP_CONTENT}</small>
        </div>
      </div>

      {todoList}
    </>
  );
}

export default App;
