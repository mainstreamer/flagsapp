import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux'
import FlagsApi from "./FlagsApi";
import axios from "axios";

class Flags extends React.Component
{
    render() {
        return (
            <div>
                <Link to="/">HOME</Link>
                <Link to="/flagsapi">FlagsAPI</Link>
                <p>Hello From Flags STATIC PAGE</p>
            </div>
        )
    }
}

export default Flags;
