import {createStore, compose} from 'redux';

export function receiveGreeting(payload) {
  console.log('receiveGreeting', payload);
  return {
    type: 'RECEIVE_GREETING',
    payload,
  };
}

export function rootReducer(state, action) {
  switch (action.type) {
    case 'RECEIVE_GREETING':
      console.log(action.type, action.payload);
      return {
        ...state,
        greeting: action.payload,
      };
  }
  return state;
}

export function configureStore({initialState = {}}) {
  return createStore(rootReducer, initialState, compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  ));
}
