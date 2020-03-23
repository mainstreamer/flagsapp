import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux'
import FlagsApi from "./FlagsApi";

// import s from './styles.scss';
// function componentDidMount() {
//     dispatch('add');
// }

// class Flags extends React.Component {
//
// }
//

// const dispatch = useDispatch();
/*
const Flags = (props) => (
    <div
        // className={s.nepidor}
    >


        <Link to="/">HOME</Link>
        <p>Hello From Flags</p>
        <h1>COAOA</h1>
        {/!*{props.dispatch({action : 'add'})}*!/}
        {/!*<Link to="/cars">Najmi na menya</Link>*!/}
    </div>
);


export default Flags;

*/

class Flags extends React.Component
{
    render() {
        // const dispatch = useDispatch()
        return (

            <div>
                <Link to="/">HOME</Link>
                <Link to="/flagsapi">FlagsAPI</Link>
                <p>Hello From Flags STATIC PAGE</p>
                {/*{this.state.counter}*/}
                {/*<h1>COAOA</h1>*/}
                {/*<Link to="/cars">Najmi na menya</Link>*/}
                {/*<span>{value}</span>*/}
                {/*<button onClick={() => {*/}
                {/*    // dispatch({type : 'add'})}*/}
                {/*    alert();*/}
                {/*}>*/}
                {/*    Increment counter*/}
                {/*</button>*/}
            </div>
        )
    }
}

// export const Flags = ({ value }) => {
//
//     // console.log(dispatch);
//     // function constuctor() {
//     //     this.s
//     // }
//
//     return (
//
//         <div>
//             <Link to="/">HOME</Link>
//             <Link to="/flagsapi">FlagsAPI</Link>
//             <p>Hello From Flags STATIC PAGE</p>
//             {/*{this.state.counter}*/}
//             {/*<h1>COAOA</h1>*/}
//             {/*<Link to="/cars">Najmi na menya</Link>*/}
//             <span>{value}</span>
//             <button onClick={() =>  {
//                 dispatch({type : 'add'})}}>
//                 Increment counter
//             </button>
//         </div>
//     )
// }

export default Flags;