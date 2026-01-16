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

    // Check if animation should be shown (once per day)
    const shouldShowAnimation = () => {
        const lastAnimDate = localStorage.getItem('homeAnimationDate');
        const today = new Date().toDateString();
        if (lastAnimDate === today) {
            return false;
        }
        return true;
    };

    const [skipAnimation] = useState(!shouldShowAnimation());

    // Animation states
    const [animPhase, setAnimPhase] = useState(skipAnimation ? 7 : 0);
    // Phase 0: blank
    // Phase 1: title visible
    // Phase 2: description visible
    // Phase 3: table slides in (blurred)
    // Phase 4: "High Scores" bounces in
    // Phase 5: rows unblur from bottom (except top)
    // Phase 6: buttons visible (top scorer still blurred)
    // Phase 7: top scorer revealed
    const [revealedRows, setRevealedRows] = useState([]);

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

    // Animation sequence
    useEffect(() => {
        if (loading) return;

        // Skip animation if already shown today
        if (skipAnimation) {
            // Reveal all rows immediately
            const allRows = Array.from({ length: Math.min(leaderboard.length, 10) }, (_, i) => i);
            setRevealedRows(allRows);
            return;
        }

        const timers = [];

        // Phase 1: Title appears (after 300ms)
        timers.push(setTimeout(() => setAnimPhase(1), 300));

        // Phase 2: Description appears (after 900ms)
        timers.push(setTimeout(() => setAnimPhase(2), 900));

        // Phase 3: Table slides in blurred (after 1600ms)
        timers.push(setTimeout(() => setAnimPhase(3), 1600));

        // Phase 4: "High Scores" bounces in (after 2400ms)
        timers.push(setTimeout(() => setAnimPhase(4), 2400));

        // Phase 5: Rows unblur from bottom one by one (after 3600ms)
        timers.push(setTimeout(() => {
            setAnimPhase(5);
            // Reveal rows from bottom to top (except index 0)
            const rowCount = Math.min(leaderboard.length, 10);
            for (let i = rowCount - 1; i >= 1; i--) {
                const delay = (rowCount - 1 - i) * 200;
                timers.push(setTimeout(() => {
                    setRevealedRows(prev => [...prev, i]);
                }, delay));
            }
        }, 3600));

        // Phase 6: Buttons appear (after all rows revealed + pause, top scorer still blurred)
        const totalRowDelay = Math.max(0, leaderboard.length - 1) * 200;
        timers.push(setTimeout(() => {
            setAnimPhase(6);
        }, 3600 + totalRowDelay + 1000));

        // Phase 7: Top scorer revealed (after buttons appear)
        timers.push(setTimeout(() => {
            setRevealedRows(prev => [...prev, 0]);
            setAnimPhase(7);
            // Store today's date so animation won't show again today
            localStorage.setItem('homeAnimationDate', new Date().toDateString());
        }, 3600 + totalRowDelay + 1800));

        return () => timers.forEach(t => clearTimeout(t));
    }, [loading, leaderboard.length, skipAnimation]);

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
        <div className={`page-wrapper ${animPhase < 7 ? 'animating' : ''}`}>
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

            <Container fluid className="px-0 main-content">
                {/* Hero Section */}
                <Row className="mb-0">
                    <Col xs={12}>
                        <div className="home-hero">
                            {isLoggedIn && animPhase >= 7 && (
                                <button
                                    onClick={handleLogoutClick}
                                    className="close-btn"
                                    aria-label="Logout"
                                    title="Logout"
                                >
                                    &times;
                                </button>
                            )}
                            <h1 className={animPhase >= 1 ? 'anim-title-visible' : 'anim-hidden'}>
                                <span role="img" aria-label="checkered flag">🏁</span> Flags Quiz
                            </h1>
                            <p className={animPhase >= 2 ? 'anim-desc-visible' : 'anim-hidden'}>
                                Test your geography knowledge and compete for the top spot!
                            </p>
                            <div className={animPhase >= 6 ? 'anim-buttons-visible' : 'anim-hidden'}>
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
                        </div>
                    </Col>
                </Row>

                {/* Leaderboard Section */}
                {loading ? (
                    <div className="text-center py-5">Loading leaderboard...</div>
                ) : leaderboard.length === 0 ? (
                    <p className="text-center text-muted">No scores yet. Be the first to play!</p>
                ) : (
                    <Table
                        striped
                        hover
                        responsive
                        className={`leaderboard-table ${animPhase >= 3 ? 'anim-table-visible' : 'anim-table-hidden'}`}
                        style={{ width: '100%' }}
                    >
                        <thead>
                            <tr>
                                <th
                                    colSpan="5"
                                    className={`text-center ${animPhase >= 4 ? 'anim-highscores-bounce' : 'anim-hidden'}`}
                                    style={{ fontSize: '1.5rem', padding: '1rem' }}
                                >
                                    High Scores
                                </th>
                            </tr>
                            <tr className={animPhase >= 4 ? 'anim-fade-in' : 'anim-hidden'}>
                                <th className="text-center">#</th>
                                <th>Player</th>
                                <th className="text-center">Score</th>
                                <th className="text-center">Time</th>
                                <th className="text-center">Games</th>
                                {/* <th className="text-center">Total</th> */}
                            </tr>
                        </thead>
                        <tbody className={animPhase >= 3 ? '' : 'anim-hidden'}>
                            {leaderboard.map((player, index) => {
                                const rank = index + 1;
                                let medal = null;
                                if (rank === 1) medal = <span role="img" aria-label="gold medal">🥇</span>;
                                else if (rank === 2) medal = <span role="img" aria-label="silver medal">🥈</span>;
                                else if (rank === 3) medal = <span role="img" aria-label="bronze medal">🥉</span>;

                                const isRevealed = revealedRows.includes(index);
                                const rowClass = animPhase >= 5
                                    ? (isRevealed ? 'anim-row-revealed' : 'anim-row-blurred')
                                    : 'anim-row-blurred';

                                return (
                                    <tr key={index} className={rowClass}>
                                        <td className="text-center rank-cell">{rank}</td>
                                        <td>{medal}{player.firstName}</td>
                                        <td className="text-center score-cell">{player.highScore}</td>
                                        <td className="text-center time-cell">
                                            {(() => {
                                                const totalSeconds = player.bestTime;
                                                const minutes = Math.floor(totalSeconds / 60);
                                                const seconds = totalSeconds % 60;
                                                const pad = (n) => String(n).padStart(2, '0');
                                                return `${pad(minutes)}m ${pad(seconds)}s`;
                                            })()}
                                        </td>
                                        <td className="text-center">{player.gamesTotal}</td>
                                        {/* <td className="text-center time-cell">
                                            {(() => {
                                                const totalSeconds = player.timeTotal;
                                                const hours = Math.floor(totalSeconds / 3600);
                                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                                const seconds = totalSeconds % 60;
                                                const pad = (n) => String(n).padStart(2, '0');
                                                return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                                            })()}
                                        </td> */}
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
