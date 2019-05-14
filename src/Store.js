import reducers from "./reducers";
import thunk    from "redux-thunk"; // lets us dispatch() functions
// import logger   from "redux-logger";

let middlewares = [thunk];

import { compose, createStore, applyMiddleware } from "redux";

if (__DEVELOPMENT__) {
  // middlewares.push(logger);
}

// https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      trace: true,
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
);

const store = createStore(reducers, enhancer);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    store.replaceReducer(nextRootReducer);
  });
}

module.exports = store
