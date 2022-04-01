import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import TodoListItem from './TodoListItem'
import { selectTodoIds, selectFilteredTodoIds, selectTodos } from './todosSlice';

const TodoList = () => {
  const todos = useSelector(selectTodos);
  const loadingStatus = useSelector(state => state.todos.entities.status);

  if (loadingStatus === 'loading') {
    return (
      <div className='todo-list'>
        <div className='loader'/>
      </div>
    )
  }

  // since `todos` is an array, we can loop over it
  const renderedListItems = todos.map((todo) => {
    return <TodoListItem key={todo.id} todoId={todo.id} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
