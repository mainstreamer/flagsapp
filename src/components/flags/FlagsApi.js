import React from 'react';

import { connect } from 'react-redux'

// import TelegramLoginButton from 'react-telegram-login';
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import { Link } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux'

import axios from 'axios';

class FlagsApi extends React.Component {
    // constructor() {
    //     super();
    //     // const a = useDispatch();
    // }

    async handleTelegramResponse(user) {
        console.log(user);
            const res = await axios.post('http://localhost:8000/api/login', user);
            axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.token}`};
    }

    async handleClick(action) {
        if (action === 'api') {
            const res = await axios.get('http://localhost:8000/test');
            this.props.dispatch({type : 'set', payload: {'text' : res.data.message, 'flags' : res.data.flags, 'ques' : res.data.ques, 'answer' : res.data.answer, 'answerCode' : res.data.answerCode, 'counter' : this.props.counter }});
        }

        if (action === 'increment') {
            this.props.dispatch({type : 'add'});
        }

        if (action === 'protected') {
            const res = await axios.get('http://localhost:8000/protected');
            console.log(res);
        }
    }

    async answer(action) {
        if (action === this.props.answer) {
            await axios.post('http://localhost:8000/flags/correct/'+this.props.answerCode);
            // http://localhost:8000/flags/correct/li

            this.props.dispatch({type : 'correct' })
        } else {
            this.props.dispatch({type : 'incorrect'})
        }

        this.props.dispatch({type : 'add'});

        if (this.props.counter < 10) {
            // this.handleClick('api');
        } else {
            this.props.dispatch({type : 'reset'})
        }
    }

    componentDidMount() {

        console.log(this);

     const res = axios.get('http://localhost:8000/test').then(function (res) {console.log('solved prom'); return res.data.message});

     this.props.dispatch({type : 'fire', payload : {'blabla': 'bla'}});

    }

    render() {
        return (
            <div>
                FLAGS API
                {/*{<script async src="https://telegram.org/js/telegram-widget.js?6" data-telegram-login="carthingbot" data-size="large" data-auth-method="POST" data-auth-url="https://259fd454.ngrok.io/api/login" data-request-access="write"></script>}*/}
                <TelegramLoginButton dataOnauth={ (user) => this.handleTelegramResponse(user)} botName="carthingbot" />,
                {/*<TelegramLoginButton dataOnauth={ (user: TelegramUser) => console.log(user) } botName="carthingbot" />,*/}
                <p>{this.props.text}</p>
                <p>{this.props.counter}</p>
                {/*<p>{this.props.flags}</p>*/}
                {/*Object.keys(tifs).map(key =>*/}
                {/*<option value={key}>{tifs[key]}</option>*/}
                <h1>{this.props.ques}</h1>
                {this.props.flags.map(item => (

                    <span onClick={() => this.answer(item)}>
                        <span style={{fontSize:"175px"}}>{item}</span>
                    </span>

                ))}
                <br/>

                <button onClick={() => this.handleClick('api')}>
                    Fetch from api
                </button>

                <button onClick={() => this.handleClick('increment')}>
                    Increment counter
                </button>

                <button onClick={() => this.handleClick('protected')}>
                    PROTECTED
                </button>
                {/*<button onClick={() =>*/}

                {/*{this.props.dispatch({type : 'fire'})}}>*/}
                {/*    Increment counter*/}
                {/*</button>*/}

                {/*<p>{this.res().then((res) => {console.log(res)})}</p>*/}
                {/*<p>{res}</p>*/}
                {/*componentDidMount() {*/}
                {/*fetchList(0, 1);*/}
                {/*fetchProfile();*/}
                {/*console.log('na componentDidMount nyzhno vipolnyat zaprosy');*/}

            </div>
        )
    }
}
export const token = () => this.props.token;


function mapStateToProps (state) {
    return {
        counter: state.add.counter,
        text : state.add.text,
        // flags : state.add.flags
        flags : Object.values(state.add.flags),
        ques : state.add.ques,
        answer : state.add.answer,
        answerCode : state.add.answerCode,
        token : state.add.token,
    }
}

export default connect(mapStateToProps)(FlagsApi);

// export const FlagsApi = ({ value }) => {
//     const dispatch = useDispatch();
//
//
//     // console.log(dispatch);
//
//
// }
