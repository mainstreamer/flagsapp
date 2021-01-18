import React from 'react';
import { connect } from 'react-redux'
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import { Link } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux'
import axios from "../../config/Axios";
import "./styles.css";
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ReactDOM from 'react-dom';
import Alert from 'react-bootstrap/Alert';
import api from "../../config/Api";
import {forEach} from "react-bootstrap/ElementChildren";
import { useHistory } from "react-router-dom";


class FlagsApi extends React.Component {
    
    async handleClick(action) {
        if (action === 'api') {
            const res = await axios.get(api.url+'/test');
            this.props.dispatch(
                {type : 'set', payload: 
                    {   'text' : res.data.message, 
                        'flags' : res.data.flags, 
                        'ques' : res.data.ques, 
                        'answer' : res.data.answer, 
                        'answerCode' : res.data.answerCode, 
                        'counter' : this.props.counter, 
                        'lifes' : this.props.lifes, 
                        'lifesIcon' : this.props.lifesIcon,
                        'timer' : this.props.timer,
                        'interval' : this.props.interval,
                        'maxTimer' : this.props.maxTimer,
                        'sessionTimer' : this.props.sessionTimer,
                        'flagi' : res.data.flags,
                    }
                }
            );
        }

        if (action === 'increment') {
            this.props.dispatch({type : 'add'});
        }

        if (action === 'protected') {
            const res = await axios.get(api.url+'/protected');
        }
    }

    async answer(action) {
        if (this.props.lifes == 0) { return; }

        if (action === this.props.answer) {
            this.saveAnswer(true);
        } else {
            this.saveAnswer(false);
        }
        
        if (action === this.props.answer) {
            this.stopTimer();
            await axios.post(api.url+'/flags/correct/'+this.props.answerCode);
            this.props.dispatch({type : 'correct' })
            setTimeout(() => {
                this.showFlags();
            }, 1500);
            
        } else {
            this.showCorrect();
            if (this.props.lifes == 1) {
                this.props.dispatch({type : 'incorrect'})
                this.gameOver();
            } else {
                this.stopTimer();
                this.props.dispatch({type : 'incorrect'})
                setTimeout(() => {
                    this.showFlags();
                }, 1500);
            }
        }
    }

    incorrect() {
        console.log('Incorrect');
        this.showCorrect();
        this.props.dispatch({type: 'incorrect'})
        if (this.props.lifes == 0) {
            this.gameOver();
        } else {
            setTimeout(() => {
                this.showFlags();
            }, 1500);
        }
    }
    
    timeout() {
        this.incorrect();
        this.stopTimer();
    }
    
    restartTimer() {
        this.startTimer();
    }
    
    async startGame() {
        this.stopTimer();
        await this.handleClick('api').then(() => this.startTimer()).then(() => this.prepareStat());
    }

    async showFlags() {
        await this.handleClick('api').then(() =>
                {
                    this.restartTimer();
                }
            ).then(() => this.prepareStat())
        ;
    }
    
    async gameOver() {
        this.stopTimer();
        await this.submitScore(this.props.counter, this.props.sessionTimer);
    }
    
    array = [];
    
    startTimer = () => {
        console.log('Timer start');
        this.props.dispatch({type: 'restartTimer'});

        let interval = setInterval(() => {
            this.props.dispatch({type: 'tick'});
            this.tickTimer();
        }, 1000);
            
        this.stopTimer();
        this.array.push(interval);
    }
    
    stopTimer() {
        this.array.map(item => clearInterval(item));
        this.array = [];
        console.log('Timer stop');
    }
    
    tickTimer() {
        if (this.props.timer == 15) {
   
        } else {
            if (this.props.timer == 0) {
                this.timeout();
                
            }
        }
    }
    
    showCorrect() {
        console.log('Show correct');
        let element = document.getElementById('correct');
        ReactDOM.findDOMNode(element).style.border = '3px dotted #079430';
        setTimeout(() => {
            this.hideCorrect();
        }, 1500);
    }
    
    hideCorrect() {
        console.log('Hide correct');
        let elements = document.getElementsByClassName('flag');
        for (let item of elements) {
            ReactDOM.findDOMNode(item).style.border = '3px dotted transparent';
        }
    }
    
    submitScore(score, sessionTimer) {
            const res = axios.post(api.url+'/flags/scores', { 'score' : score, 'sessionTimer' : sessionTimer, 'answers' : this.answers });
            this.answers = [];
            console.log(res);
    }

    componentDidMount() {
        window.innerWidth = 500;
        this.startGame();
        // this.foo();
    }
    componentWillUnmount() {
        this.gameOver();
    }
    

    restartGame() {
        console.log('RESTART');
        this.props.dispatch({type : 'reset'});
        this.gameOver();
        this.startGame();
    }

    answers = [];
    question = [];
    prepareStat() {
        // console.log('FOO');
        // console.log(this.props);
        // console.log(this.props.flags);
        this.props.flagi.map((item) =>
            // () => alert()
            this.question.push(item)
            // console.log(item)
            // (item) => { alert(); console.log('xaxa' + item)}
        );
        

        // this.array.map(item => clearInterval(item));
        
        
        // console.log();
        // for (let item of this.props.flagi) {
        //     this.question.push(item.getAllKeys()[0])
        // }
        // console.log(this.question);
    }
    
    saveAnswer(correct) {
        let answer = {
            correct : correct,
            answerCode : this.props.answerCode,
            options : this.question.filter((item) => item !== this.props.answerCode),
            time : this.props.maxTimer - this.props.timer
        }
        
        this.answers.push(answer);
        this.question = [];
        console.log(this.answers);
    }
    
    render() {
        return (
            <div>
            {/*//     <Container style={{ 'display' : 'flex', 'justify-content' : 'center', width: '600px'}}>*/}
            <Container fluid style={{ 'display' : 'flex', 'justify-content' : 'center'}}>

                {/*<Toast show={true} style={{ width: '410px', margin: 'auto', marginTop: '10%' }}>*/}
                <Toast show={true} style={{ 'flex-basis': '400px', 'max-width' : '400px', 'min-height' : '300px' }} onClose={this.redirect}>
                    <Toast.Header>
                        <strong className="mr-auto">Question:</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div style={{
                            'display' : 'flex',
                            'justify-content' : 'space-between',
                            'margin' : '0 10px'
                        }}>
                            <span><strong className="question-text">Select the flag of</strong></span>
                            <span>Time: <strong>{this.props.timer}</strong></span>

                        </div>

                        <h4  style={{
                            'margin' : '10px 10px'
                        }}>{this.props.ques}</h4>
                        <span  style={{
                            'display' : 'flex',
                            'justify-content' : 'space-between',
                        }}>
                        {
                            this.props.flags.map(item =>
                                (
                                    <span onClick={() => this.answer(item)}>
                                             {
                                                 this.props.answer == item
                                                     ? <span className={'flag'}  id='correct'>{item}</span>
                                                     : <span className={'flag'}>{item}</span>
                                             }
                                        </span>
                                )
                            )
                        }
                        </span>
                        <Alert key={'idx'} variant={'warning'} style={this.props.lifes <= 0 ? {display: 'block'} : {display: 'none'} }>
                            <strong>GAME OVER! Your score: {this.props.counter}</strong>
                        </Alert>
                
                        <div style={{
                            'display' : 'flex',
                            'justify-content' : 'space-between',
                            'margin' : '10px',
                            'margin-bottom' : '0px'
                        }}>
                            <span>{this.props.text}&nbsp;</span>
                            <span>Total time: {this.props.sessionTimer}</span>
                        </div>
                        <div style={{
                            'display' : 'flex',
                            'justify-content' : 'space-between',
                            'margin' : '10px',
                            'margin-top' : '0px'
                        }}>
                            <span>{this.props.lifesIcon}</span>
                            <span>Score: <strong>{this.props.counter}</strong></span>
                        </div>
                        
                    </Toast.Body>
                </Toast>
                {/*<button onClick={ () => this.submitScore(4)}>PEW</button>*/}
                
            </Container>
                <div style={{'display' : 'flex', 'margin-top' : '25px', 'justify-content' : 'center'}}>
                    <Button variant="outline-secondary" onClick={() => this.restartGame()}>
                        RESTART
                    </Button>&nbsp;
                    <Button variant="outline-secondary" onClick={() => this.redirectToProfile()}>
                        PROFILE
                    </Button>
                </div>
        </div>
    )
}
    redirect = () => {
        this.gameOver();
        this.props.dispatch({type : 'reset'});
        this.props.history.push('/main');
    }

    redirectToProfile = () => {
        this.gameOver();
        this.props.history.push('/profile');
    }
}

function mapStateToProps (state) {
    return {
        counter: state.add.counter,
        text : state.add.text,
        flagi : state ? Object.keys(state.add.flags) : {},
        flags : state ? Object.values(state.add.flags) : {},
        ques : state.add.ques,
        answer : state.add.answer,
        answerCode : state.add.answerCode,
        token : state.add.token,
        lifes : state.add.lifes,
        lifesIcon : state.add.lifesIcon,
        timer: state.add.timer,
        interval : state.add.interval,
        maxTimer: state.add.maxTimer,
        sessionTimer: state.add.sessionTimer,
    }
}

export default connect(mapStateToProps)(FlagsApi);
