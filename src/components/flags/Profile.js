import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux'
import FlagsApi from "./FlagsApi";
import axios from "axios";
import api from "../../config/Api";

const Profile = () => 
{
    const [user, setUser] = useState('loading...');
    useEffect(  () => {
        axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`};
        const per = axios.get(api.url+'/protected');
        per.then(res => (setUser(res.data)));
    }, []);
        return (
            <div>
                <p>PROFILE PAGE</p>
                <p>Name: {user.firstName} {user.lastName}</p>
                <p>High scores: {user.highScore}</p>
                <p>Total games: {user.gamesTotal}</p>
                <p>Best time: {user.bestTime}</p>
                <p>Time total: {user.timeTotal}</p>
                <p><img src={user.telegramPhotoUrl}/></p>
            </div>
        )
    // }
}

export default Profile;
