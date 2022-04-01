import {client} from '../../api/client';
import {StatusFilters} from '../filters/filtersSlice';
import {
  createSlice, 
  createAsyncThunk,
  createEntityAdapter,
  createSelector
} from '@reduxjs/toolkit';

const todosAdapter = createEntityAdapter();

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoToggled(state, action) {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      todo.completed = !todo.completed;
    },
    todoColorSelected: {
      reducer(state, action) {
        const {color, todoId} = action.payload;
        state.entities[todoId].color = color;
      },
      prepare(todoId, color) {
        return {
          payload: {todoId, color}
        }
      }
    },
    //использование ф-ции даптера для удаления todo по айди
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state, actions) {
      Object.values(state.entities).forEach(todo => {
        todo.completed = true
      })
    },
    completedTodosCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
        //использование функции адаптера как "mutating" update хелпера 
        todosAdapter.removeMany(state, completedIds)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {};
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo;
        })
        state.entities = newEntities;
        state.status = 'idles'
      })
      //использование другого адаптера как редюсера для добавления todo
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  }
})

const selectTodoEntities  = state => state.todos.entities

export const todosLoading = () => ({ type: 'todos/todosLoading' })

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('fakeApi/todos')
  return response.todos
})

//нужно написать внешнюю функцию которая принимает параметр text
export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
  const initialTodo = {text};
  const response = await client.post('/fakeApi/todos', { todo: initialTodo });
  return response.todo
})

export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}

export const {
  todoAdded, 
  todoToggled, 
  todoColorSelected, 
  todoDeleted,
  allTodosCompleted,
  completedTodosCleared,
} = todosSlice.actions;

export default todosSlice.reducer

export const {selectAll: selectTodos, selectById: selectTodoById} = 
  todosAdapter.getSelectors(state => state.todos)

export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: current status filter
  state => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const {status, colors} = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed;
    // Return either active or completed todos based on filter
    return todos.filter(todo => {
      const statusMatches = 
        showAllCompletions || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filteredTodos => filteredTodos.map(todo => todo.id)
)