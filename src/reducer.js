const initialState = {
    todos: [
        { id: 0, text: 'Learn React', completed: true },
        { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
        { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
    ],
    filters: {
        status: 'All',
        colors: []
    }
}

function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);

    return maxId + 1;
}

//использование initialState как дефолтное значение
export default function appReducer(state = initialState, action) {
    //редюсер обычно смотрит на поле ТИП у действия и решает, что происходит
    switch (action.type) {
        //сделать что-то здесь, основанное на разных типах действий
        case 'todos/todoAdded': {
            //нужно вернуть новый объект состояния
            return {
                //он содержит все существующие данные состояния
                ...state,
                //но у него есть новый массив для поля todos
                todos: [
                    //вместе сос старыми todos
                    ...state.todos,
                    //добавляется новый todo объект
                    {
                        //использование авто-инкремента ID
                        id: nextTodoId(state.todos),
                        text: action.payload,
                        completed: false
                    }
                ]
            }
        }
        case 'todos/todoToggled': {
            return {
                //снова копируется весь объект состояния
                ...state,
                //теперь нам нужно сделать копию старого массива todos
                todos: state.todos.map(todo => {
                    //если не элемент в todo, который мы ищем, томы пропускаем его
                    if (todo.id !== action.payload) {
                        return todo;
                    }

                    //мы нашли todo, который надо поменять. возвращается копия
                    return {
                        ...todo,
                        //поднимается флаг завершения
                        completed: !todo.completed
                    }
                })
            }
        }
        case 'filters/statusFilterChanged': {
            return {
                //скопировать все состояние
                ...state,
                //перезаписать фильтры 
                filters: {
                    //копирование других полей фильтра
                    ...state.filters,
                    //замена поля статус новым значением
                    state: action.payload
                }
            }
        }
        default:
            //если редюсер не опознал тип действия, или не нужно
            //беспокоится о каком-специфичном действии, возвращается существующее состояние неизменное
            return state
    }
}