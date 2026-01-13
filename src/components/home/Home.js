import React, {useEffect, useState} from 'react';
import "./styles.css";
import axios from "../../config/Axios";
import api from "../../config/Api";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { useOAuth } from '../../hooks/useOAuth';
import Button from "react-bootstrap/Button";
import { useHistory } from 'react-router-dom';

const Home = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const { login: oauthLogin, isLoading } = useOAuth();
    const history = useHistory();

    const isTokenValid = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        const expiresAt = localStorage.getItem('tokenExpiresAt');

        // Token exists but no expiration - legacy token, treat as expired
        if (!expiresAt) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return false;
        }

        // Check if token is expired (with 60s buffer)
        if (Date.now() >= parseInt(expiresAt) - 60000) {
            // Token expired, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiresAt');
            return false;
        }

        return true;
    };

    useEffect(() => {
        setIsLoggedIn(isTokenValid());

        axios.get(api.url + '/api/flags/scores')
            .then(res => {
                setLeaderboard(res.data.slice(0, 10));
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading leaderboard:', err);
                setLoading(false);
            });
    }, []);

    const handlePlay = () => {
        history.push('/flagsapi');
    };

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
        setIsLoggedIn(false);
        setShowLogoutPopup(false);
    };

    const handleLogoutCancel = () => {
        setShowLogoutPopup(false);
    };

    return (
        <div className="page-wrapper">
            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div className="popup-overlay" onClick={handleLogoutCancel}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <p>Logout?</p>
                        <div className="popup-buttons">
                            <Button
                                variant="outline-secondary"
                                onClick={handleLogoutConfirm}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={handleLogoutCancel}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Container className="py-5 main-content">
                {/* Hero Section */}
                <Row className="mb-5">
                    <Col xs={12} md={8} lg={6} className="mx-auto">
                        <div className="home-hero">
                            {isLoggedIn && (
                                <button
                                    onClick={handleLogoutClick}
                                    className="close-btn"
                                    aria-label="Logout"
                                    title="Logout"
                                >
                                    &times;
                                </button>
                            )}
                            <h1><span role="img" aria-label="checkered flag">🏁</span> Flags Quiz</h1>
                            <p>Test your geography knowledge and compete for the top spot!</p>
                            {isLoggedIn ? (
                                <>
                                    <Button
                                        size="lg"
                                        onClick={handlePlay}
                                        className="btn-cta"
                                        style={{ textTransform: 'uppercase' }}
                                    >
                                        Play
                                    </Button>
                                    {' '}
                                    <Button
                                        variant="outline-secondary"
                                        size="lg"
                                        onClick={() => history.push('/profile')}
                                        style={{ textTransform: 'uppercase' }}
                                    >
                                        Profile
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={oauthLogin}
                                    disabled={isLoading}
                                    className="btn-cta"
                                    style={{ textTransform: 'uppercase' }}
                                >
                                    {isLoading ? 'Logging in...' : 'Login to Play'}
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Leaderboard Section */}
                {loading ? (
                    <div className="text-center py-5">Loading leaderboard...</div>
                ) : leaderboard.length === 0 ? (
                    <p className="text-center text-muted">No scores yet. Be the first to play!</p>
                ) : (
                    <Table striped hover responsive className="leaderboard-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th colSpan="6" className="text-center" style={{ fontSize: '1.5rem', padding: '1rem' }}>
                                    High Scores
                                </th>
                            </tr>
                            <tr>
                                <th className="text-center">Rank</th>
                                <th>Player</th>
                                <th className="text-center">Top Score</th>
                                <th className="text-center">Best Time</th>
                                <th className="text-center">Games</th>
                                <th className="text-center">Time Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((player, index) => {
                                const rank = index + 1;
                                let medal = null;
                                if (rank === 1) medal = <span role="img" aria-label="gold medal">🥇 </span>;
                                else if (rank === 2) medal = <span role="img" aria-label="silver medal">🥈 </span>;
                                else if (rank === 3) medal = <span role="img" aria-label="bronze medal">🥉 </span>;

                                return (
                                    <tr key={index}>
                                        <td className="text-center rank-cell">{medal}{rank}</td>
                                        <td>{player.firstName}</td>
                                        <td className="text-center score-cell">{player.highScore}</td>
                                        <td className="text-center time-cell">
                                            {(() => {
                                                const totalSeconds = player.bestTime;
                                                const minutes = Math.floor(totalSeconds / 60);
                                                const seconds = totalSeconds % 60;
                                                const pad = (n) => String(n).padStart(2, '0');
                                                return `${pad(minutes)}:${pad(seconds)}`;
                                            })()}
                                        </td>
                                        <td className="text-center">{player.gamesTotal}</td>
                                        <td className="text-center time-cell">
                                            {(() => {
                                                const totalSeconds = player.timeTotal;
                                                const hours = Math.floor(totalSeconds / 3600);
                                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                                const seconds = totalSeconds % 60;
                                                const pad = (n) => String(n).padStart(2, '0');
                                                return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                                            })()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                )}
            </Container>

            {/* Footer */}
            <footer className="app-footer">
                <Container>
                    <div className="footer-content">
                        <div className="footer-left">
                            <span>Flags Quiz</span>
                            <span className="footer-divider">|</span>
                            <span className="footer-version">{process.env.REACT_APP_VERSION || 'dev'}</span>
                        </div>
                        <div className="footer-center">
                            <span>Feedback: <a href="mailto:admin@izeebot.top">admin@izeebot.top</a></span>
                        </div>
                        <div className="footer-right">
                            <span>&copy; {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    )
}

export default Home;
