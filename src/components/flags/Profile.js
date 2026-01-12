import React, { useEffect, useState } from 'react';
import axios from "axios";
import api from "../../config/Api";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Alert from "react-bootstrap/Alert";
import { useHistory } from 'react-router-dom';

const Profile = () => {
    const history = useHistory();
    const [key, setKey] = useState('learn');
    const [user, setUser] = useState(null);
    const [statsData, setStatsData] = useState([]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        axios.get(`${api.url}/api/flags/protected`, config)
            .then(res => setUser(res.data))
            .catch(err => console.error("Error loading user profile:", err));

        axios.get(`${api.url}/api/flags/correct`, config)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setStatsData(data);
            })
            .catch(err => console.error("Error loading flag stats:", err));

    }, []);

    // Show a loader if user data hasn't arrived yet
    if (!user) {
        return <div className="p-5 text-center">Loading Profile Data...</div>;
    }

    // Filter for Learn tab: < 75% guess rate, exclude never shown, sorted by rate ASC (lowest first)
    const learnData = statsData
        .filter(item => item.times_shown > 0 && item.rate < 75)
        .sort((a, b) => a.rate - b.rate);

    // Stats tab: all data sorted by guess rate DESC
    const allStats = [...statsData].sort((a, b) => b.rate - a.rate);

    const renderStatsTable = (data, emptyMessage) => (
        <Table striped hover>
            <thead>
                <tr>
                    <th>Flag</th>
                    <th>Country</th>
                    <th className="text-center">Shown</th>
                    <th className="text-center">Correct</th>
                    <th className="text-center">Guess Rate</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ fontSize: '50px' }}>{item.flag}</td>
                        <td>{item.country}</td>
                        <td className="text-center">{item.times_shown}</td>
                        <td className="text-center">{item.times_guessed}</td>
                        <td className="text-center">
                            {item.times_shown > 0 ? (
                                <span style={{
                                    color: item.rate >= 75 ? '#28a745' : item.rate >= 50 ? '#ffc107' : '#dc3545',
                                    fontWeight: 'bold'
                                }}>
                                    {item.rate}%
                                </span>
                            ) : (
                                <span className="text-muted">n/a</span>
                            )}
                        </td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center text-muted">{emptyMessage}</td></tr>}
            </tbody>
        </Table>
    );

    const handleClose = () => {
        history.push('/');
    };

    return (
        <div style={{ minHeight: '100vh', margin: '0px', padding: '0px' }}>
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', position: 'relative' }}>
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            opacity: 0.5
                        }}
                        aria-label="Close"
                    >
                        &times;
                    </button>
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
                        <ListGroupItem style={{ width: '100%' }}>{user.bestTime}s</ListGroupItem>
                    </ListGroup>
                    <ListGroup horizontal>
                        <ListGroupItem style={{ minWidth: '12em' }}>Total games:</ListGroupItem>
                        <ListGroupItem style={{ width: '100%' }}>{user.gamesTotal}</ListGroupItem>
                    </ListGroup>
                    <ListGroup horizontal>
                        <ListGroupItem style={{ minWidth: '12em' }}>Time total:</ListGroupItem>
                        <ListGroupItem style={{ width: '100%' }}>{formatTime(user.timeTotal)}</ListGroupItem>
                    </ListGroup>
                </ListGroup>
            </Card>

            <Tabs
                id="profile-stats-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mt-3"
            >
                <Tab eventKey="learn" title="Learn">
                    <Alert variant="info" className="mt-3 mb-2">
                        Practice these flags to improve your score! Focus on the ones you miss most often.
                    </Alert>
                    {renderStatsTable(learnData, "Great job! No flags need extra practice.")}
                </Tab>
                <Tab eventKey="stats" title="Stats">
                    {renderStatsTable(allStats, "No guesses recorded yet. Start playing!")}
                </Tab>
            </Tabs>
        </div>
    );
}

export default Profile;