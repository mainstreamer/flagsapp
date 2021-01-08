import { combineReducers } from 'redux';
// import axios from 'axios';
import axios from '../config/Axios';
const { Map } = require('immutable');


const getInitialState = () =>
    new Map({
        counter : 0
    });


const substract = (state, action) =>
    state.withMutations(newState => {
        new Map({
            counter : state.counter--,
        })
    });

const add = (state) => {
    return {
        'counter' : state.counter || 0,
        'text' : state.text,
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'lifes' : state.lifes,
        'lifesIcon' : state.lifesIcon,
        'timer' : state.timer,
        'interval' : state.interval,
        'maxTimer' : state.maxTimer,
    }
}


const reset = (state) => {
    return {
        'counter' : 0,
        'text' : state.ques,
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : state.token,
        'lifes' : 3,
        'lifesIcon' : '🟢🟢🟢',
        'timer' : state.maxTimer,
        'interval' : state.interval,
        'maxTimer' : state.maxTimer,
};
}

const correct = (state) => {
    return {
        'counter' : ++state.counter,
        // 'text' : state.text+' CORRECT!!!',
        'text' : "✅ THAT'S RIGHT!",
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : state.token,
        'lifes' : state.lifes,
        'lifesIcon' : state.lifesIcon,
        'timer' : state.timer,
        'interval' : state.interval,
        'maxTimer' : state.maxTimer,
    }
}

const incorrect = (state) => {
    return {
        'counter' : state.counter,
        // 'text' : state.text+ ' INCORRECT :( ',
        'text' : '❌ NO ',
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : state.token,
        'lifes' : --state.lifes,
        'lifesIcon' : state.lifes == 2 ? '🟢🟢🔴' : state.lifes == 1 ? '🟢🔴🔴' : '🔴🔴🔴',
        'timer' : state.maxTimer,
        'interval' : state.interval,
        'maxTimer' : state.maxTimer,
    }
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
        'lifes' : state.lifes,
        'lifesIcon' : state.lifesIcon,
        'timer' : state.timer,
        'interval' : state.interval,
        'maxTimer' : state.maxTimer,
    };
}

const auth = (state, payload) => {

    return {
        'counter' : state.counter,
        'text' : state.text,
        'flags' : state.flags,
        'ques' : state.ques,
        'answer' : state.answer,
        'answerCode' : state.answerCode,
        'token' : payload.token,
        'lifes' : state.lifes,
        'lifesIcon' : state.lifesIcon,
        'timer' : state.timer,
        'interval' : state.interval,
        'maxTimer' : state.maxTimer,
    };
}

const fire = (state, action) => {
    console.log(state);
}


const tick = (state) => {
    // state.timer = --state.timer;
    return {
        ...state,
        'timer' : --state.timer
    };
}

const restartTimer = (state) => {
    return {
        ...state,
        'timer' : state.maxTimer
    }
}

const startTimer = (state) => {
    return {
        ...state,
    }
}

const stopTimer = (state) => {
    return {
        ...state
    }
}


const initial = (state, action) => {
    // alert('initial state set');
    return { 
        'counter' : 0, 
        'text' : 'no data', 
        'flags' : {}, 
        'ques' : 'ques', 
        'answer' : '-', 
        'answerCode' : '', 
        'token' : '', 
        'lifes' : '3', 
        'lifesIcon' : '🟢🟢🟢',
        'timer' : 3,
        'maxTimer' : 3,
        'interval' : ''
    }
}



export default (state = () =>
    new Map({
        counter : 0
        // access: window.token,
    }), action) => {
    switch (action.type) {
        case 'add': return add(state);
        case 'initial': return  initial(state);
        case 'set' : return set(state, action);
        case 'correct' : return correct(state);
        case 'incorrect' : return incorrect(state);
        case 'reset' : return reset(state);
        case 'auth' : return auth(state, action.payload);
        case 'tick' : return tick(state);
        case 'restartTimer' : return restartTimer(state);
        case 'stopTimer' : return stopTimer(state);
        case 'startTimer' : return startTimer(state, action.payload);
        // case constants.LOGIN:
        //     return tokenLoading.setLoading(state);
        default:
            return state;
    }
};
