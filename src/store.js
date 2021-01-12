import { applyMiddleware, createStore } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// import Immutable from 'immutable';
// import thunk from 'redux-thunk';
// import API from 'api';

// import { normalize } from 'normalizr';
// import * as schemas from 'utils/schemas';


// import { baseURL } from 'config';

// import { reducers } from './reducers/initial';
import appReducers  from './reducers/index';

/* eslint-disable */
export let apiInstance;
/* eslint-enable */

const storeCreator = () => {
    // const composeEnhancers = composeWithDevTools({
    //     serialize: {
    //         immutable: Immutable,
    //     },
    // });
    //
    // const thunkExtraArguments = {
    //     schemas,
    //     normalize,
    // };
    //
    // const actionTimestamp = () => next => action =>
    //     next({
    //         ...action,
    //         timestamp: new Date(),
    //     });

    const store = createStore(
        appReducers,
        // composeEnhancers(applyMiddleware(thunk.withExtraArgument(thunkExtraArguments)), applyMiddleware(actionTimestamp)),
    );

    // apiInstance = new API(store, { baseURL, withCredentials: true });

    // thunkExtraArguments.api = apiInstance;

    return { store };
};

export default storeCreator;
