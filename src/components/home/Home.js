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

const Home = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { login: oauthLogin, isLoading } = useOAuth();

    useEffect(() => {
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

    return (
        <Container className="py-5">
            {/* Hero Section */}
            <Row className="mb-5">
                <Col xs={12} md={8} lg={6} className="mx-auto">
                    <div className="home-hero">
                        <h1><span role="img" aria-label="checkered flag">🏁</span> Flags Quiz</h1>
                        <p>Test your geography knowledge and compete for the top spot!</p>
                        <Button
                            variant="success"
                            size="lg"
                            onClick={oauthLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login to Play'}
                        </Button>
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
                                            <th className="text-center">High Score</th>
                                            <th className="text-center">Best Time</th>
                                            <th className="text-center">Games</th>
                                            <th className="text-center">Hours</th>
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
                                                    <td className="text-center">{player.bestTime}s</td>
                                                    <td className="text-center">{player.gamesTotal}</td>
                                                    <td className="text-center">{(player.timeTotal / 3600).toFixed(2)}</td>
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
    )
}

export default Home;
