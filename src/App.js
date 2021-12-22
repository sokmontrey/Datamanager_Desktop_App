import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect,
    useHistory
} from 'react-router-dom';

import MainPage from './Route/MainPage.js';

export default function App(){
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/">
                    <Redirect to='/add' />
                </Route>

                <Route exact path="/add">
                    <MainPage page='add' id='' />
                </Route>

                <Route path='/edit/:id'
                render={(props)=>
                    <MainPage page='edit' id={props.match.params.id} />
                } />
            </Switch>
        </HashRouter>
    );
}