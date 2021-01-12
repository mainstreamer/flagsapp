import React, {useEffect, useState} from 'react';
import "./styles.css";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import axios from "../../config/Axios";
import { useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import api from "../../config/Api";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Home = () => {
    const history = useHistory();
    const [some, setSome] = useState('loading...');
    const handleTelegramResponse = async (user) => {
        const res = await axios.post(api.url+'/api/login', user);
        axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.token}`};
        localStorage.setItem('accessToken', res.data.token);
        history.push('/flagsapi');
    };
    
    const login = async () => {
        const res = await axios.get(api.url+'/token');
        axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.token}`};
        localStorage.setItem('accessToken', res.data.token);
        history.push('/flagsapi');
    }
    
    useEffect(  () => {
        const per = axios.get(api.url+'/flags/scores');
         per.then(res => (
            setSome(res.data.map((item) => (
                
                <li>
                    {item.firstName} score: {item.highScore} ({item.bestTime} sec) 
                    [total: {item.gamesTotal} games {(item.timeTotal/3600).toFixed(2)} hours]</li>)))
        ));
         
         if (api.mode === 'dev') {
             // alert();
         }
        
    }, []);
    
    return (
            <Container>
                <Row >
                    <Col xs={12} s={12} lg={12} md={12}>
                        <Card style={{'height' : window.innerHeight}}>
                            <Card.Header style={{'display' : 'flex', 'justify-content': 'center'}}><h3>Flags quiz</h3></Card.Header>
                            <Card.Body>
                                <Card.Title style={{'display' : 'flex', 'justify-content': 'center', 'margin-right' : '20px'}}>High scores:</Card.Title>
                                <Card.Text style={{'display' : 'flex', 'justify-content': 'center', 'margin-right' : '20px'}}>
                                    <ul style={{'align' : 'center'}}>
                                        {some}
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                            
                            <Card.Footer style={{'display' : 'flex', 'justify-content': 'center'}}>
                                <TelegramLoginButton dataOnauth={(user) => handleTelegramResponse(user)} botName="carthingbot" />
                                {api.mode == 'dev' ? <button onClick={login}>
                                    Login
                                </button> : '' } 
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
        </Container>
    )
}

export default Home;
