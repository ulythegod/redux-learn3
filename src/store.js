import {configureStore} from '@reduxjs/toolkit'
import { applyMiddleware, compose, createStore } from '@reduxjs/toolkit'
import { ThunkMiddleware } from 'redux-thunk'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

import monitorReducerEnhancer from './enhancers/monitorReducer'
import loggerMiddleware from './middleware/logger'

const rootReducer = {
  todos: todosReducer,
  filters: filtersReducer
};

const store = configureStore({
  reducer: rootReducer
})
//Один вызов configureStore делает:
// - комбинирует todosReducer и filtersReducer в корневую функцию редюсер, которая будет поддерживать 
//корневое состояние которые выглядит как {todos, filters}
// - создает Redux store используя корневой редюсер
// - автоматически добавляет thunk middleware
// - автоматически добавляет больше middleware для проврерки общих ошибок типа 
//случайного изменения состояния
// - автоматически устанавливает Redux DevTools Extension связь

export default store
