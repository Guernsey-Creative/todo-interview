import { memo } from 'react';
import { ToDo } from '../ApiClient';
import { TodoItem } from './TodoItem';

export interface ITodoListProps {
  todos: ToDo[];
  handleToggleDone: Function;
}

/**
 * List of Todos for user.
 *
 * Wrap in memo (memoize the component) so that React doesn't
 * re-render child elements if it's not required. React handles
 * the fancy caching, so we don't have to worry about it.
 *
 * I think memoizing the component is a good step at performance, in
 * case we have 1 million or more todos. However, if we have that many
 * we will also want to consider virtual scrolling, so the browser doesn't
 * crash for a user. We can save that for when there's more time :)
 */
export const TodoList = memo(function TodoList({
  todos,
  handleToggleDone,
}: ITodoListProps) {
  const todoList = todos.map((todo) => (
    <TodoItem
      id={todo.id}
      key={todo.id}
      done={todo.done}
      label={todo.label}
      handleToggleDone={() => handleToggleDone(todo.id)}
    />
  ));

  // Update the div element to <ul> for better accessibility,
  // and then fix the margin offset
  return <div>{todoList}</div>;
});
