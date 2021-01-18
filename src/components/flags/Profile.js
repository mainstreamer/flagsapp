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
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const Profile = () => 
{
    const [key, setKey] = useState('incorrect');
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
                <Card >
                    <Card.Img variant="left" src={user.telegramPhotoUrl} />
                    <Card.Body>
                        <Card.Title>{user.firstName} {user.lastName} (@{user.telegramUsername})</Card.Title>
                        {/*<Card.Text>*/}
                        {/*    Some quick example text to build on the card title and make up the bulk of*/}
                        {/*    the card's content.*/}
                        {/*</Card.Text>*/}
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup horizontal>
                            <ListGroupItem style={{ 'min-width' : '20em'}}>High score:</ListGroupItem>
                            <ListGroupItem style={{ 'width' : '100%'}}>{user.highScore}</ListGroupItem>
                        </ListGroup>
                        <ListGroup horizontal>
                            <ListGroupItem style={{ 'min-width' : '20em'}}>Best time:</ListGroupItem>
                            <ListGroupItem style={{ 'width' : '100%'}}>{user.bestTime}</ListGroupItem>
                        </ListGroup>
                        <ListGroup horizontal>
                            <ListGroupItem style={{ 'min-width' : '20em'}}>Total games:</ListGroupItem>
                            <ListGroupItem style={{ 'width' : '100%'}}> {user.gamesTotal}</ListGroupItem>
                        </ListGroup>
                        <ListGroup horizontal>
                            <ListGroupItem style={{ 'min-width' : '20em'}}>Time total:</ListGroupItem>
                            <ListGroupItem style={{ 'width' : '100%'}}>{user.timeTotal}</ListGroupItem>
                        </ListGroup>
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

                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="incorrect" title="Incorrect">
                        <Table striped={true}>
                            <tbody>
                                {incorrect}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="correct" title="Correct">
                        <Table striped={true}>
                            <tbody>
                                {correct}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
            </div>
        )
    // }
}

export default Profile;
