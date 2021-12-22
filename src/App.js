import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect,
    useHistory
} from 'react-router-dom';

import MainPage from './Route/MainPage.js';

import { create_empty } from './Controllers/DataController.js';

import { JSON_DB } from './Controllers/DatabaseController.js';
const jdb = new JSON_DB();

export default function App(){

    const all_key = jdb.read_key();
    !all_key.length ? create_empty() : null;
    const first_key = all_key[0];

    return (
        <HashRouter>
            <Switch>
                <Route exact path="/">
                    <MainPage id={first_key} />
                </Route>

                <Route path='/edit/:id'
                render={(props)=>
                    <MainPage id={props.match.params.id} />
                } />
            </Switch>
        </HashRouter>
    );
}