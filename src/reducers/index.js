import { combineReducers } from 'redux';

import add from './initial';

const entities = {
    add,
};

const appReducers = combineReducers({
    ...entities,
});

export default appReducers;
