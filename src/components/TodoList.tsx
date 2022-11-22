import { memo, useState, useEffect } from 'react';
import { ToDo } from '../ApiClient';
import { TodoItem } from './TodoItem';
import { StrictModeDroppable } from './StrictModeDroppable';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';

export interface ITodoListProps {
  todos: ToDo[];
  loading: boolean;
  handleToggleDone: Function;
  onListChange: Function;
}

/**
 * Helper function to reorder the the updated list.
 */
const reorder = (list: ToDo[], startIndex: number, endIndex: number) => {
  // Create new array from list
  const result = Array.from(list);

  // Get the moved item in the array
  const [removed] = result.splice(startIndex, 1);

  // Update index movement for moved item
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: `0 0 ${grid}px 0`,
  borderRadius: '5px',

  // change background color if dragging
  background: isDragging ? 'gainsboro' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

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
 *
 * Notes:
 * - Add Drag and Drop elements
 * - Get demo working first
 * - Update with Todo Components
 * - Update todo array order
 */
export const TodoList = memo(function TodoList({
  todos,
  loading,
  handleToggleDone,
  onListChange,
}: ITodoListProps) {
  // Create a state for todos because we probably
  // don't want to mutate the props
  const [todoItems, setTodoItems] = useState<ToDo[]>([]);

  // Watch changes for todos from parent
  useEffect(() => {
    setTodoItems(todos);
  }, [todos]);

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const updatedItems = reorder(
      todoItems,
      result.source.index,
      result.destination.index
    );

    // Update the local state
    setTodoItems(updatedItems);

    // Update todo array order in the parent
    onListChange(updatedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, _) => (
          <div
            role="list"
            className="todo-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {todoItems.map((todo, index) => (
              <Draggable
                key={todo.id}
                draggableId={todo.id}
                index={index}
                isDragDisabled={loading}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <TodoItem
                      id={todo.id}
                      key={todo.id}
                      done={todo.done}
                      label={todo.label}
                      loading={loading}
                      handleToggleDone={() => handleToggleDone(todo.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
});
