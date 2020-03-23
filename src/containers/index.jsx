import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import Home from '../components/home/Home.js';
// import Container from '../containers/flagContainer';
import Flags from "../components/flags/Flags.js";
import FlagsApi from "../components/flags/FlagsApi.js";
// import Pervij from 'components/pervij';
// import Vtoroi from 'components/vtoroi';
// import Tretij from 'components/tretij';
// import Chitvertiy from 'components/chitvertiy';
// import Piatiy from 'components/piatiy';
// import Cars from 'components/cars';
// import { fetchList, fetchProfile } from '../actions/action-primer';

class Application extends React.Component {
    // componentDidMount() {
    //     fetchList(0, 1);
    //     fetchProfile();
    //     console.log('na componentDidMount nyzhno vipolnyat zaprosy');e
    // }

    render() {
        return (
            // console.log(this.props.store),
            <Switch>
                {/*<Route path="/flags" component={Flags} store={this.props.store} />*/}
                {/*<Route render={(props) => <Flags {...props} store={this.props.store} />} />*/}

                    {/*!// path="/flags" component={Flags} store={this.props.store} />*/}

                {/*<Route path="/5" component={Piatiy} />*/}
                {/*<Route path="/4" component={Chitvertiy} />*/}
                {/*<Route path="/3" component={Tretij} />*/}
                {/*<Route path="/2" component={Vtoroi} />*/}
                {/*<Route path="/1" component={Pervij} />*/}
                <Route path="/flagsapi" component={FlagsApi} />
                <Route path="/flags" component={Flags} />
                <Route path="/" component={Home} />
            </Switch>
        );
    }
}

// export default Application;
export default hot(module)(Application);
