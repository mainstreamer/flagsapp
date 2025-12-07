import React, { useEffect, useState } from 'react';
import axios from "axios";
import api from "../../config/Api"; // Ensure this returns { url: '' }
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const Profile = () => {
    const [key, setKey] = useState('incorrect');
    const [user, setUser] = useState(null); // Changed to null for easier loading state check
    const [correct, setCorrect] = useState([]);
    const [incorrect, setIncorrect] = useState([]);

    useEffect(() => {
        // 1. Setup Headers for this component
        const token = localStorage.getItem('accessToken');
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        // 2. Data conversion helper
        const convertData = (data) => {
            if (!Array.isArray(data)) return [];
            return data.map((item, index) => (
                <tr key={index}>
                    <td style={{ fontSize: '75px' }}>{item.flag}</td>
                    <td>{item.country}</td>
                    <td>({item.flagCode})</td>
                    <td>{item.times}</td>
                </tr>
            ));
        };

        // 3. API Calls (Using Relative paths due to Proxy)
        // Note: api.url should be an empty string '' in your config
        axios.get(`${api.url}/api/protected`, config)
            .then(res => setUser(res.data))
            .catch(err => console.error("Error loading user profile:", err));

        axios.get(`${api.url}/api/correct`, config)
            .then(res => setCorrect(convertData(res.data)))
            .catch(err => console.error("Error loading correct flags:", err));

        axios.get(`${api.url}/api/incorrect`, config)
            .then(res => setIncorrect(convertData(res.data)))
            .catch(err => console.error("Error loading incorrect flags:", err));

    }, []);

    // Show a loader if user data hasn't arrived yet
    if (!user) {
        return <div className="p-5 text-center">Loading Profile Data...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', margin: '0px', padding: '0px' }}>
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
                    <Card.Img 
                        variant="left" 
                        src={user.telegramPhotoUrl} 
                        style={{ width: '150px', borderRadius: '50%' }} 
                    />
                    <Card.Body>
                        <Card.Title>
                            {user.firstName} {user.lastName} 
                            {user.telegramUsername ? ` (@${user.telegramUsername})` : ''}
                        </Card.Title>
                    </Card.Body>
                </div>

                <ListGroup className="list-group-flush">
                    <ListGroup horizontal>
                        <ListGroupItem style={{ minWidth: '12em' }}>High score:</ListGroupItem>
                        <ListGroupItem style={{ width: '100%' }}>{user.highScore}</ListGroupItem>
                    </ListGroup>
                    <ListGroup horizontal>
                        <ListGroupItem style={{ minWidth: '12em' }}>Best time:</ListGroupItem>
                        <ListGroupItem style={{ width: '100%' }}>{user.bestTime}</ListGroupItem>
                    </ListGroup>
                    <ListGroup horizontal>
                        <ListGroupItem style={{ minWidth: '12em' }}>Total games:</ListGroupItem>
                        <ListGroupItem style={{ width: '100%' }}>{user.gamesTotal}</ListGroupItem>
                    </ListGroup>
                    <ListGroup horizontal>
                        <ListGroupItem style={{ minWidth: '12em' }}>Time total:</ListGroupItem>
                        <ListGroupItem style={{ width: '100%' }}>{user.timeTotal}</ListGroupItem>
                    </ListGroup>
                </ListGroup>
            </Card>

            <Tabs
                id="profile-stats-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mt-3"
            >
                <Tab eventKey="incorrect" title="Incorrect">
                    <Table striped hover>
                        <tbody>
                            {incorrect.length > 0 ? incorrect : <tr><td colSpan="4">No incorrect guesses yet.</td></tr>}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="correct" title="Correct">
                    <Table striped hover>
                        <tbody>
                            {correct.length > 0 ? correct : <tr><td colSpan="4">No correct guesses yet.</td></tr>}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </div>
    );
}

export default Profile;