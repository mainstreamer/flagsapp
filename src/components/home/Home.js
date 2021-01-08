import React, {useEffect, useState} from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
// import axios from "axios";
import axios from "../../config/Axios";
import { useHistory } from "react-router-dom";
// import s from './styles.scss';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from "react-bootstrap/Card";
import api from "../../config/Api";

const Home = () => {
    
    const history = useHistory();
    const [some, setSome] = useState('ytn');
    const handleTelegramResponse = async (user) => {
        const res = await axios.post(api.url+'/api/login', user);
        axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.token}`};
        history.push('/flagsapi');
    };
    
    // const getScores = async (user) => {
    //     const aka = await axios.get('http://localhost:8000/flags/scores', user);
    //     props.scores = aka;
    //     // console.log(aka.data[0].firstName);
    // }

    
    // const listScores = (some) => some.map((score) =>
    //     <li>{score}</li>
    // );
 
    // const getScores = async (user, props) => {
    //     return await axios.get('http://localhost:8000/flags/scores', user);
    //     // props.scores = aka;
    //     // console.log(props);
    //     // console.log(aka.data[0].firstName);
    // }

    // const scores = (user) => {
    //     return axios.get('http://localhost:8000/flags/scores', user).data[0].firstName;
    //     // console.log(aka.data[0].firstName);
    // }
    useEffect(  () => {
        const per = axios.get(api.url+'/flags/scores');
        // setSome(per);
        
         per.then(res => (
            setSome(res.data.map((item) => (<li>{item.firstName}  {item.highScore} </li>)))
        ));
        
    }, []);
    
    return (
        <div style={{ width: '300px', margin: 'auto', marginTop: '20%' }}>
            <Card border="dark">
                <Card.Header><h3>Flags quiz</h3></Card.Header>
                <Card.Body>
                    <Card.Title>High scores:</Card.Title>
                    <Card.Text>
                        {some}
                        
                    </Card.Text>
                    
                </Card.Body>
                <Card.Footer><TelegramLoginButton dataOnauth={(user) => handleTelegramResponse(user)} botName="carthingbot" /></Card.Footer>
            </Card>
            <br />
        {/*<h2>Flags app</h2>*/}
        {/*<h3>Please login 👇🏻</h3>*/}
        {/*<p>*/}
            
            {/*<button onClick={getScores}>OK</button>*/}
           
        {/*</p>*/}

        {/*<Jumbotron fluid>*/}
        {/*    */}
        {/*    /!*{listScores(some)}*!/*/}
        {/*   */}
        {/*</Jumbotron>*/}
        {/*<h3>OR sign up ☝🏻</h3>*/}
    </div>)
}

export default Home;
