import React, { useEffect, useState } from 'react';
import axios from "axios";
import api from "../../config/Api";
import Table from "react-bootstrap/Table";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useHistory } from 'react-router-dom';
import "../home/styles.css";

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

    if (!user) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    const learnData = statsData
        .filter(item => item.times_shown > 0 && item.rate < 75)
        .sort((a, b) => a.rate - b.rate);

    const allStats = [...statsData].sort((a, b) => b.rate - a.rate);

    const renderStatsTable = (data, emptyMessage) => (
        <Table striped hover size="sm">
            <thead>
                <tr>
                    <th>Flag</th>
                    <th>Country</th>
                    <th className="text-center">Shown</th>
                    <th className="text-center">Correct</th>
                    <th className="text-center">Rate</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ fontSize: '2rem' }}>{item.flag}</td>
                        <td>{item.country}</td>
                        <td className="text-center">{item.times_shown}</td>
                        <td className="text-center">{item.times_guessed}</td>
                        <td className="text-center">
                            <span style={{
                                color: item.rate >= 75 ? '#28a745' : item.rate >= 50 ? '#ffc107' : '#dc3545',
                                fontWeight: 'bold'
                            }}>
                                {item.rate}%
                            </span>
                        </td>
                    </tr>
                )) : <tr><td colSpan="5" className="text-center text-muted">{emptyMessage}</td></tr>}
            </tbody>
        </Table>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <div style={{
                background: '#fff',
                padding: '1.5rem',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                position: 'relative'
            }}>
                <button
                    onClick={() => history.push('/')}
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        color: '#666',
                        lineHeight: 1
                    }}
                >
                    &times;
                </button>
                <img
                    src={user.telegramPhotoUrl}
                    alt=""
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>
                        {user.firstName} {user.lastName}
                    </div>
                    {user.telegramUsername && (
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>@{user.telegramUsername}</div>
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1px',
                background: '#eee',
                borderBottom: '1px solid #eee'
            }}>
                {[
                    { label: 'High Score', value: user.highScore },
                    { label: 'Best Time', value: `${user.bestTime}s` },
                    { label: 'Games', value: user.gamesTotal },
                    { label: 'Total Time', value: formatTime(user.timeTotal) }
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: '#fff',
                        padding: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <Tabs
                id="profile-stats-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mt-2"
                style={{ paddingLeft: '1rem' }}
            >
                <Tab eventKey="learn" title="Learn">
                    <div style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#666' }}>
                        Flags below 75% - practice these!
                    </div>
                    {renderStatsTable(learnData, "No flags need practice.")}
                </Tab>
                <Tab eventKey="stats" title="All Stats">
                    {renderStatsTable(allStats, "No data yet.")}
                </Tab>
            </Tabs>
        </div>
    );
}

export default Profile;