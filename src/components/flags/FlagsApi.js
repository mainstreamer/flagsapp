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
        await this.handleClick('api').then(() => this.startTimer());
    }

    async showFlags() {

        await this.handleClick('api').then(() =>
                {
                    this.restartTimer();
                }
            )
        ;

    }
    
    async gameOver() {
        this.stopTimer();
        await this.submitScore(this.props.counter);
    }
    
    array = [];
    
    startTimer = () => {
        console.log('Timer start');
        this.props.dispatch({type: 'restartTimer'});

        let interval = setInterval(() => {
            this.props.dispatch({type: 'tick'});
            this.tickTimer();
        }, 1000);
            
        this.array.push(interval);
    }
    
    
    stopTimer() {
        for (let i = 0; i < this.array.length;  i++) {
            clearInterval(this.array[i]);
        }
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
        let element = document.getElementById('correct');
        ReactDOM.findDOMNode(element).style.border = '3px dotted transparent';
    }
    
    submitScore(score) {
            const res = axios.post(api.url+'/flags/scores', { 'score' : score });
            console.log(res);
    }

    componentDidMount() {
        this.startGame();
    }
    
    restartGame() {
        this.props.dispatch({type : 'reset'});
        this.startGame();
    }

    redirect = () => {
        this.props.history.push('/main');
    }
    
    render() {
        
        return (
            <div >
                <Container style={{ 'display' : 'flex', 'justify-content' : 'center', width: '600px'}}>
                    
                    {/*<Toast show={true} style={{ width: '410px', margin: 'auto', marginTop: '10%' }}>*/}
                    <Toast show={true} style={{ 'flex-basis': '400px', 'min-height' : '300px' }} onClose={this.redirect}>
                        
                        <Toast.Header>
                            <strong className="mr-auto">Question:</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <div style={{
                                'display' : 'flex',
                                'justify-content' : 'space-between',
                            }}>
                                <span><strong className="question-text">Select the flag of</strong></span>
                                <span>Time: <strong>{this.props.timer}</strong></span>

                            </div>

                            
                            <h4>{this.props.ques}</h4>
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
                            <Alert key={'idx'} variant={'warning'} style={this.props.lifes <= 0 ? {display: 'block'} : {display: 'none'} }>
                                <strong>GAME OVER! Your score: {this.props.counter}</strong>
                            </Alert>
                            <div style={{
                                'display' : 'flex',
                                'justify-content' : 'space-between',
                            }}>
                                <span>{this.props.text}&nbsp;</span>
                                
                            </div>
                            
                            <div style={{
                                'display' : 'flex',
                                'justify-content' : 'space-between',
                            }}>
                                <span>{this.props.lifesIcon}</span>
                                <span>Score: <strong>{this.props.counter}</strong></span>

                            </div>
                        </Toast.Body>
                    </Toast>
                    {/*<button onClick={ () => this.submitScore(4)}>PEW</button>*/}
                </Container>
                {/*        <Button variant="outline-primary" onClick={() => this.handleClick('protected')}>*/}
                {/*            PROFILE*/}
                {/*        </Button>*/}

                <div style={{'display' : 'flex', 'margin-top' : '75px', 'justify-content' : 'center'}}>
                    <Button variant="outline-secondary" onClick={() => this.restartGame()}>
                        RESTART
                    </Button>
                </div>
                </div>
            
        )
    }
}

function mapStateToProps (state) {
    return {
        counter: state.add.counter,
        text : state.add.text,
        flags : Object.values(state.add.flags),
        ques : state.add.ques,
        answer : state.add.answer,
        answerCode : state.add.answerCode,
        token : state.add.token,
        lifes : state.add.lifes,
        lifesIcon : state.add.lifesIcon,
        timer: state.add.timer,
        interval : state.add.interval,
        maxTimer: state.add.maxTimer,
    }
}

export default connect(mapStateToProps)(FlagsApi);
