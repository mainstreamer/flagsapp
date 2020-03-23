import { combineReducers } from 'redux';
// import axios from 'axios';
import axios from '../config/Axios';
const { Map } = require('immutable');

// import auth from './auth';

// export const entities = {
//     auth,
// };

// const appReducers = combineReducers({
//     ...entities,
// });

// export default appReducers;

const getInitialState = () =>
    new Map({
        counter : 0
        // access: window.token,

    });
//
//
// const add = (state, action) => new Map({
//     counter : 2 });
//     // state.withMutations(newState => {
//     //     new Map({
//     //         counter : state.counter++,
//     //     })
//     //     // const { result: userId } = action.payload;
//     //     // newState.set('userId', userId);
//     // });

const substract = (state, action) =>
    state.withMutations(newState => {
        new Map({
            counter : state.counter--,
        })
        // const { result: userId } = action.payload;
        // newState.set('userId', userId);
    });

const add = (state) => {
    return {
        'counter' : ++state.counter || 0,
        'text' : state.ques,
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
    }
}
//
// const add = (state) => {
//     const m = new Map(state);
//     const newm = m.set('counter', ++state.counter);
//     console.log(newm);
//     console.log({...newm._root.entries});
//
//     // console.log( m.set('counter', ++state.counter));
//
//     // console.log(m);
//     // return m;
// };

// (state) => {
//     return {
//         'counter' : ++state.counter || 0,
//         'text' : state.ques,
//         'flags' : state.flags,
//         'ques' : state.ques,
//         'answer' : state.answer,
//         'answerCode' : state.answerCode,
//     };
// }

const reset = (state) => {
    return {
        'counter' : 0,
        'text' : state.ques,
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : state.token,
    };
}

const correct = (state) => {
    return {
        'counter' : state.counter,
        'text' : state.ques+' CORRECT!!!',
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : state.token,
    };
}

const incorrect = (state) => {
    return {
        'counter' : state.counter,
        'text' : state.ques+ ' INCORRECT :( ',
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : state.token,
    };
}

const set = (state, action) => {
    return action.payload;

    return {
        'counter' : state.counter,
        'text' : state.ques+ ' INCORRECT :( ',
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : action.payload.token,
    };

    // return action.payload;
    // some.text  = action.payload.text;
    // const res = action.payload;
    // return some;
    // console;
    // return { 'counter' : res }
    // console.log();
    // return action.payload;
    // console.log(axios.get('http://localhost:8000/test'));
}

const auth = (state, payload) => {

    return {
        'counter' : state.counter,
        'text' : state.ques,
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : payload.token,
    };

    // some.text  = action.payload.text;
    // const res = action.payload;

    // return some;
    // console;
    // return { 'counter' : res }
    // console.log();
    // return action.payload;
    // console.log(axios.get('http://localhost:8000/test'));
}

const fire = (state, action) => {

console.log(state);
    // console.log(axios.get('http://localhost:8000/test'));

    // return axios.get('http://localhost:8000/test').then(function (res) {
    //     alert('priletelo');
    //     console.log(res);
    //     return res.data.message
    // });



    // async function get() {
    //     return
    // }
    // return {};

    // console.log(response);
    // return { 'counter' : 100500 }
}

 async function fireF(state, action){

}

const initial = (state, action) => {
    // alert('initial state set');
    return { 'counter' : 0, 'text' : 'no data', 'flags' : {}, 'ques' : 'ques', 'answer' : '-', 'answerCode' : '', 'token' : '' }
}

export default (state = () =>
    new Map({
        counter : 0
        // access: window.token,
    }), action) => {
    switch (action.type) {
        case 'add': return add(state);
        // case 'fire': return fireF(state).then( (r) => { this.store.dispatch({'type' : set, 'arg' : r})} );
        // case 'fire': return fireF(state).then( (r) => { this.store.dispatch({'type' : set, 'arg' : r})} );
        case 'initial': return  initial(state);
        case 'set' : return set(state, action);
        case 'correct' : return correct(state);
        case 'incorrect' : return incorrect(state);
        case 'reset' : return reset(state);
        case 'auth' : return auth(state, action.payload);

        // case constants.LOGIN:
        //     return tokenLoading.setLoading(state);
        // case constants.LOGIN_FAILED:
        //     return tokenLoading.setLoadFailed(state);
        // case constants.REFRESH:
        //     return refreshLoading.setLoading(state);
        // case constants.REFRESH_FAILED:
        //     return refreshLoading.setLoadFailed(state);
        // case constants.LOGIN_SUCCESS:
        //     return login(state, action);
        // case constants.PROFILE_SUCCESS:
        //     return profile(state, action);
        // case constants.INVITE_LOAD_START:
        //     return inviteLoadProgress.setLoading(state);
        // case constants.INVITE_LOAD_SUCCESS:
        //     return inviteLoaded(state, action);
        // case constants.INVITE_LOAD_FAILED:
        //     return inviteLoadProgress.setLoadFailed(state);
        // case constants.REFRESH_SUCCESS:
        //     return refresh(state, action);
        // case constants.LOGOUT:
        //     return clear(state);
        default:
            return state;
    }
};
