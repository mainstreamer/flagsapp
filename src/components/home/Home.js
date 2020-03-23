import React from 'react';
import { Link } from 'react-router-dom';

// import s from './styles.scss';

const Home = () => (
    <div // className={s.nepidor}
    >
        <p>HOME PAGE</p>
        <Link to="/flags">FLAGS</Link>
    </div>
);

export default Home;
