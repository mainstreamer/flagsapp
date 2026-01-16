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

    gameEnded = false;
    answerLocked = false;

    state = {
        loading: true,
        paused: false
    };

    async handleClick(action) {
        if (action === 'api') {
            try {
                const res = await axios.get(api.url+'/api/flags/test');
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
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    this.handleUnauthorized();
                    return;
                }
                throw err;
            }
        }

        if (action === 'increment') {
            this.props.dispatch({type : 'add'});
        }

        if (action === 'protected') {
            try {
                const res = await axios.get(api.url+'/api/flags/protected');
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    this.handleUnauthorized();
                    return;
                }
                throw err;
            }
        }
    }

    handleUnauthorized = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
        this.props.dispatch({type : 'reset'});
        this.props.history.push('/');
    }

    async answer(action) {
        if (this.props.lifes == 0) { return; }
        if (this.answerLocked) { return; }

        this.answerLocked = true;

        if (action === this.props.answer) {
            this.saveAnswer(true);
        } else {
            this.saveAnswer(false);
        }
        
        if (action === this.props.answer) {
            this.stopTimer();
            try {
                await axios.post(api.url+'/api/flags/correct/'+this.props.answerCode);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    this.handleUnauthorized();
                    return;
                }
            }
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
        this.gameEnded = false;
        this.answerLocked = false;
        this.setState({ loading: true, paused: false });
        this.stopTimer();
        await this.handleClick('api')
            .then(() => this.startTimer())
            .then(() => this.prepareStat())
            .then(() => this.setState({ loading: false }));
    }

    async showFlags() {
        await this.handleClick('api').then(() => {
                if (!this.state.paused) {
                    this.restartTimer();
                }
            }).then(() => this.prepareStat())
            .then(() => {
                this.answerLocked = false;
            });
    }
    
    async gameOver() {
        if (this.gameEnded) {
            return;
        }
        this.gameEnded = true;
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

    togglePause = () => {
        if (this.props.lifes <= 0) return;

        if (this.state.paused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame = () => {
        this.stopTimer();
        this.setState({ paused: true });
    }

    resumeGame = () => {
        this.setState({ paused: false });
        this.startTimerFromCurrent();
    }

    startTimerFromCurrent = () => {
        let interval = setInterval(() => {
            this.props.dispatch({type: 'tick'});
            this.tickTimer();
        }, 1000);

        this.array.push(interval);
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
    
    async submitScore(score, sessionTimer) {
        try {
            await axios.post(api.url+'/api/flags/scores', { 'score' : score, 'sessionTimer' : sessionTimer, 'answers' : this.answers });
            this.answers = [];
        } catch (err) {
            if (err.response && err.response.status === 401) {
                this.handleUnauthorized();
            }
        }
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
        this.props.flagi.map((item) =>
            this.question.push(item)
        );
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
        if (this.state.loading) {
            return <div className="p-5 text-center">Fetching question...</div>;
        }

        return (
            <div className="game-wrapper">
            <Container fluid className="game-container">
                <Toast show={true} className="game-toast" onClose={this.redirect}>
                    <Toast.Header>
                        <strong className="mr-auto">Question:</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div style={{
                            'display' : 'flex',
                            'justify-content' : 'space-between',
                            'padding' : '0 12px',
                            'alignItems' : 'center'
                        }}>
                            <span><strong className="question-text">Select the flag of</strong></span>
                            <span>Time: <strong>{this.props.timer}</strong></span>
                        </div>

                        <h4  style={{
                            'margin' : '10px 10px'
                        }}>{this.props.ques}</h4>
                        <div className={`flags-container ${this.state.paused ? 'paused' : ''}`}>
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
                        {this.state.paused && (
                            <div className="pause-overlay" onClick={this.togglePause}>
                                PAUSED
                            </div>
                        )}
                        </div>
                        <Alert key={'idx'} variant={'warning'} style={this.props.lifes <= 0 ? {display: 'block'} : {display: 'none'} }>
                            <strong>GAME OVER! Your score: {this.props.counter}</strong>
                        </Alert>
                
                        <div style={{
                            'display' : 'flex',
                            'justify-content' : 'space-between',
                            'margin' : '10px',
                            'margin-bottom' : '0px'
                        }}>
                            <div className="feedback-container">
                                <span className={(this.props.text || '').includes('RIGHT') ? 'feedback-correct' : (this.props.text || '').includes('NO') ? 'feedback-incorrect' : ''}>
                                    {this.props.text}&nbsp;
                                </span>
                            </div>
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
                <div className="game-buttons">
                    <Button variant="outline-secondary" onClick={() => this.exitGame()}>
                        QUIT
                    </Button>
                    <Button variant="outline-secondary" onClick={() => this.restartGame()}>
                        RESTART
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={this.togglePause}
                        disabled={this.props.lifes <= 0}
                        className="btn-pause"
                    >
                        {this.state.paused ? '▶ RESUME' : '❚❚ PAUSE '}
                    </Button>
                </div>
        </div>
    )
}
    redirect = () => {
        this.gameOver();
        this.props.dispatch({type : 'reset'});
        this.props.history.push('/');
    }

    exitGame = () => {
        this.gameOver();
        this.props.dispatch({type : 'reset'});
        this.props.history.push('/');
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
