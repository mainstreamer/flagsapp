import React, {useEffect, useState} from 'react';
import "./styles.css";
import axios from "../../config/Axios";
import Card from "react-bootstrap/Card";
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
    const { login: oauthLogin, isLoading } = useOAuth();
    const history = useHistory();

    const isTokenValid = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        const expiresAt = localStorage.getItem('tokenExpiresAt');
        if (expiresAt) {
            // Check if token is expired (with 60s buffer)
            if (Date.now() >= parseInt(expiresAt) - 60000) {
                // Token expired, clear it
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiresAt');
                return false;
            }
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

    return (
        <>
            <Container className="py-5">
                {/* Hero Section */}
                <Row className="mb-5">
                    <Col xs={12} md={8} lg={6} className="mx-auto">
                        <div className="home-hero">
                            <h1><span role="img" aria-label="checkered flag">🏁</span> Flags Quiz</h1>
                            <p>Test your geography knowledge and compete for the top spot!</p>
                            {isLoggedIn ? (
                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={handlePlay}
                                >
                                    Play
                                </Button>
                            ) : (
                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={oauthLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'Login to Play'}
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Leaderboard Section */}
                <Row>
                    <Col xs={12} lg={10} className="mx-auto">
                        <Card>
                            <Card.Header as="h3" className="text-center">
                                High Scores
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-5">Loading leaderboard...</div>
                                ) : leaderboard.length === 0 ? (
                                    <p className="text-center text-muted">No scores yet. Be the first to play!</p>
                                ) : (
                                    <Table striped hover responsive className="leaderboard-table">
                                        <thead>
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
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
        </>
    )
}

export default Home;
