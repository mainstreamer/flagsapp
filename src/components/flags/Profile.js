import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux'
import FlagsApi from "./FlagsApi";
import axios from "axios";
import api from "../../config/Api";
import isPlainObject from "react-redux/lib/utils/isPlainObject";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

const Profile = () => 
{
    const [user, setUser] = useState('loading...');
    const [correct, setCorrect] = useState('loading...');
    const [incorrect, setIncorrect] = useState('loading...');
    useEffect(  () => {
        axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`};
        const per = axios.get(api.url+'/protected');
        per.then(res => (setUser(res.data)));

        const correctResponse = axios.get(api.url+'/correct');
        correctResponse.then(res => (setCorrect(convert(res.data)))).catch(r =>console.log(r));
        
        const incorrectResponse = axios.get(api.url+'/incorrect');
        incorrectResponse.then(res => 
            setIncorrect(convert(res.data))
        );
        
        const convert = (item) => {
            return item.map((item) =>
                <tr>
                    <td style={{ fontSize : '75px' }}>{item.flag}</td>
                    <td>{item.country}</td>
                    <td>({item.flagCode})</td>
                    <td>{item.times}</td>
                </tr>
            );
        }
    }, []);
        return (
            <div>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={user.telegramPhotoUrl} />
                    <Card.Body>
                        <Card.Title>Profile</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>High scores: {user.highScore}</ListGroupItem>
                        <ListGroupItem>Best time: {user.bestTime}</ListGroupItem>
                        <ListGroupItem>Total games: {user.gamesTotal}</ListGroupItem>
                        <ListGroupItem>Time total: {user.timeTotal}</ListGroupItem>
                    </ListGroup>
                    {/*<Card.Body>*/}
                    {/*    <Card.Link href="#">Card Link</Card.Link>*/}
                    {/*    <Card.Link href="#">Another Link</Card.Link>*/}
                    {/*</Card.Body>*/}
                </Card>
                {/*<p>PROFILE PAGE</p>*/}
                {/*<p>Name: {user.firstName} {user.lastName}</p>*/}
                {/*<p>High scores: {user.highScore}</p>*/}
                {/*<p>Total games: {user.gamesTotal}</p>*/}
                {/*<p>Best time: {user.bestTime}</p>*/}
                {/*<p>Time total: {user.timeTotal}</p>*/}
                {/*<p><img src={user.telegramPhotoUrl}/></p>*/}
                <h3>Incorrect</h3>
                <Table>
                    <tbody>
                        {incorrect}
                    </tbody>
                </Table>
                <h3>Correct</h3>
                <Table>
                    <tbody>
                        {correct}
                    </tbody>
                </Table>
            </div>
        )
    // }
}

export default Profile;
