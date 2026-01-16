import React from 'react';
import "./styles.css";
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

const TestLayout = () => {
    // Mock data
    const timer = 12;
    const sessionTimer = 45;
    const counter = 7;
    const lifesIcon = '❤️❤️❤️';
    const ques = 'Germany';
    const text = 'RIGHT!';
    const flags = ['🇩🇪', '🇫🇷', '🇮🇹', '🇪🇸'];
    const paused = false;
    const lifes = 3;

    return (
        <div className="game-wrapper">
            <Container fluid className="game-container">
                <Toast show={true} className="game-toast">
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">Question:</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div style={{
                            'display': 'flex',
                            'justifyContent': 'space-between',
                            'padding': '0 12px',
                            'alignItems': 'center'
                        }}>
                            <span><strong className="question-text">Select the flag of</strong></span>
                            <span>Time: <strong>{timer}</strong></span>
                        </div>

                        <h4 style={{
                            'margin': '10px 10px'
                        }}>{ques}</h4>
                        <div className={`flags-container ${paused ? 'paused' : ''}`}>
                            {flags.map((item, idx) => (
                                <span key={idx}>
                                    <span className={'flag'}>{item}</span>
                                </span>
                            ))}
                            {paused && (
                                <div className="pause-overlay">
                                    PAUSED
                                </div>
                            )}
                        </div>
                        <Alert key={'idx'} variant={'warning'} style={lifes <= 0 ? { display: 'block' } : { display: 'none' }}>
                            <strong>GAME OVER! Your score: {counter}</strong>
                        </Alert>

                        <div style={{
                            'display': 'flex',
                            'justifyContent': 'space-between',
                            'margin': '10px',
                            'marginBottom': '0px'
                        }}>
                            <div className="feedback-container">
                                <span className={text.includes('RIGHT') ? 'feedback-correct' : text.includes('NO') ? 'feedback-incorrect' : ''}>
                                    {text}&nbsp;
                                </span>
                            </div>
                            <span>Total time: {sessionTimer}</span>
                        </div>
                        <div style={{
                            'display': 'flex',
                            'justifyContent': 'space-between',
                            'margin': '10px',
                            'marginTop': '0px'
                        }}>
                            <span>{lifesIcon}</span>
                            <span>Score: <strong>{counter}</strong></span>
                        </div>

                    </Toast.Body>
                </Toast>

            </Container>
            <div className="game-buttons">
                <Button variant="outline-secondary">
                    QUIT
                </Button>
                <Button variant="outline-secondary">
                    RESTART
                </Button>
                <Button
                    variant="outline-secondary"
                    className="btn-pause"
                >
                    ❚❚ PAUSE
                </Button>
            </div>
        </div>
    );
}

export default TestLayout;
