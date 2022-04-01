const reduxThunkMiddleware = storeApi => next => action => {
    //если action это функция
    if (typeof action === 'function') {
        //затем вызывается функция и передаются dispatch и getState в качестве аргументов
        //также возвращается то, что thunk функция возвращает
        return action(storeApi.dispatch, storeApi.getState)
    }

    //если это обычное action, оно просто отправляется дальше
    return next(action)
}