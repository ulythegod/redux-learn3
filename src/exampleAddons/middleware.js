export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1')
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}

//exampleMiddleware - внешняя функция, которая и есть middleware. Она будет вызвана applyMiddleware
//она получает объект storeAPI, который хранит ф-ции хранилища {dispatch, getState}. Это
//те же ф-ции dispatch и getState, которые реально являются частью хранилища. Можно вызвать 
//ф-цию dispatch, она отправит действие к началу middleware pipeline. Вызывается только
//один раз
export function exampleMiddleware(storeAPI) {
  //warpDispatch - средняя ф-ция, принимает ф-цию next в аргументе. Эта функция по факту след
  //middleware в пайплайне. Если этот middleware последний в последовательности, next становится
  //оригинальной ф-цией store.dispatch вместо этого. Вызов next(action) переданный в action к 
  //следующему пайплайну. Также вызывается всего раз 
  return function warpDispatch(next) {
    //handleAction - наконец-то внутренняя ф-ция получает текущее действие в аргументе, и 
    //будет вызыватся каждый раз, как действие отправляется
    return function handleAction(action) {
      console.log('exampleMiddleware', '4');

      return next(action)
    }
  }
}

export const loggerMiddleware = storeAPI => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', storeAPI.getState());
  return result;
}

export const alwaysReturnHelloMiddleware = storeAPI => next => action => {
  const originalResult = next(action);

  return 'Hello!';
}

export const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload);
    });

    return next(action)
  }
}
