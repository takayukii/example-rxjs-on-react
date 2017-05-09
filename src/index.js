import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './App';
import {configureStore} from './redux-things';

const initialState = {
  greeting: 'Hello RxJS!!'
};
ReactDOM.render(
  <Provider store={configureStore({initialState})}>
    <App/>
  </Provider>,
  document.getElementById('spa-root')
);
