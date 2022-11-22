export interface ITodoItemProps {
  id: string;
  done: boolean;
  label: string;
  handleToggleDone: Function;
}

/**
 * Todo Item for the list of todos
 */
export const TodoItem = ({
  id,
  done,
  label,
  handleToggleDone,
}: ITodoItemProps) => {
  return (
    <div key={id} className="todo-item">
      <label style={{ textDecoration: done ? 'line-through' : 'none' }}>
        {label}
      </label>
      <button onClick={() => handleToggleDone(id)}>
        Mark {done ? 'Undone' : 'Done'}
      </button>
    </div>
  );
};
