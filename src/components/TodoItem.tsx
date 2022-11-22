export interface ITodoItemProps {
  id: string;
  done: boolean;
  label: string;
  loading: boolean;
  handleToggleDone: Function;
}

/**
 * Todo Item for the list of todos
 */
export const TodoItem = ({
  id,
  done,
  label,
  loading,
  handleToggleDone,
}: ITodoItemProps) => {
  const loadingClass = loading ? 'is-disabled' : '';

  return (
    <div key={id} className="todo-item" role="listitem">
      <label style={{ textDecoration: done ? 'line-through' : 'none' }}>
        {label}
      </label>

      <button
        className={loadingClass}
        disabled={loading}
        onClick={() => handleToggleDone(id)}
      >
        Mark {done ? 'Undone' : 'Done'}
      </button>
    </div>
  );
};
