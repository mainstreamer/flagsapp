import React from 'react';
import { connect } from 'react-redux';
import Flags from '../components/flags/Flags';
import { Link } from 'react-router-dom';

function Container(props) {
    return (
        // props.loggedIn
        //     <div><Flags flags={props.flags} /></div>
            <div><Flags /></div>
            // : <div>Please login to view profile.</div>
    )
}

    // const mapStateToProps = function(state) {
    //     return {
    //         profile: state.user.profile,
    //         loggedIn: state.auth.loggedIn
    //     }
    // }

export default connect()(Container);




// import s from './styles.scss';
// function componentDidMount() {
//     dispatch('add');
// }

// class Flags extends React.Component {
//
// }
// //
//
// const Flags = (props) => (
//     <div
//         // className={s.nepidor}
//     >
//         <Link to="/">HOME</Link>
//         <p>Hello From Flags</p>
//         <h1>COAOA</h1>
//         {props.store}
//         {/*<Link to="/cars">Najmi na menya</Link>*/}
//     </div>
// );

// export default Flags;
