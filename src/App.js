import React from 'react';
import logo from './logo.svg';
import { Provider } from 'react-redux'
// import './App.css';
import {
  BrowserRouter as Router,
  StaticRouter, // for server rendering
  Switch,
  Route,
  Link
  // etc.
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Application from './containers/index.jsx';

// import reducer from './reducers/initial.js';

import appReducers  from './reducers/index';
import { createStore } from 'redux';

// import storeCreator from './store'
import Flags from "./components/flags/Flags";
import Home from "./components/home/Home";
import FlagsApi from "./components/flags/FlagsApi";
import Profile from "./components/flags/Profile";

//
// const store = storeCreator();
//
//
//

const store = createStore(appReducers);

// function addTodo(text) {
//   return {
//     type: 'ADD_TODO',
//     text
//   }
// }

// store.dispatch(addTodo('Read the docs'))
// store.dispatch(addTodo('Read about the middleware'))


store.dispatch({type: 'initial'});
// store.dispatch('add');
function App() {
  return (
    <div>
      <Provider store={store}>
          <Router>
              <Switch>
                <Route path="/flagsapi" component={FlagsApi} />
                  <Route path="/profile" component={Profile} />
                <Route path="/flags" component={Flags} />
                <Route path="/" component={Home} />
            {/*<Application />*/}
              </Switch>
          </Router>
          {/*{store.getState()}*/}
      </Provider>
    </div>
  );
}

export default App;
