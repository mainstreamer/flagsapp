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

class ScoresFetcher extends React.Component {

    // async handleTelegramResponse(user) {
    //     console.log(user);
    //         const res = await axios.post('http://localhost:8000/api/login', user);
    //         axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.token}`};
    // }

    componentDidMount() {

        console.log(this);

     const res = axios.get('http://localhost:8000/test').then(function (res) {console.log('solved prom'); return res.data.message});

     // this.props.dispatch({type : 'fire', payload : {'blabla': 'bla'}});

    }

    render() {
        return (
            <Jumbotron fluid>
                {/*FLAGS API*/}
                {/*{<script async src="https://telegram.org/js/telegram-widget.js?6" data-telegram-login="carthingbot" data-size="large" data-auth-method="POST" data-auth-url="https://259fd454.ngrok.io/api/login" data-request-access="write"></script>}*/}
                {/*<TelegramLoginButton dataOnauth={ (user) => this.handleTelegramResponse(user)} botName="carthingbot" />,*/}
                {/*<TelegramLoginButton dataOnauth={ (user: TelegramUser) => console.log(user) } botName="carthingbot" />,*/}
                
                <Container>
                    <Toast show={true}>
                        <Toast.Header>
                            <strong className="mr-auto">Question:</strong>
                        </Toast.Header>
                        <Toast.Body>
                                <strong className="question-text">Select the flag of</strong><br /> <h4>{this.props.ques}</h4>
                            {
                                this.props.flags.map(item => 
                                    (
                                        <span onClick={() => this.answer(item)}>
                                            <span style={{fontSize:"75px"}}>{item}</span>  
                                        </span>
                                    )
                                )
                            }
                            
                            <p>{this.props.text} &nbsp;</p>
                            {/*<p>COUNTER: {this.props.counter}</p>*/}
                            {/*<h1>QUESTION: {this.props.ques}</h1>*/}
                            <Row>
                                <Col md={{ span: 1, offset: 8 }}>
                                    <Button variant="outline-primary" onClick={() => this.handleClick('api')}>
                                        NEXT
                                    </Button>
                                </Col>
                            </Row>
                        </Toast.Body>
                    </Toast>
                    <Row>
                        <Col md={{ span: 1, offset: 10 }}>
                            <Button variant="outline-primary" onClick={() => this.handleClick('protected')}>
                                PROFILE
                            </Button>
                        </Col>
                    </Row>
                </Container>
                
            
            </Jumbotron>
        )
    }
}

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
