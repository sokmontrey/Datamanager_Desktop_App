import React from 'react';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import MainPage from './Route/MainPage.js';

import { create_empty } from './Controllers/DataController.js';
import { JSON_DB } from './Controllers/DatabaseController.js';

const jdb = new JSON_DB();

export default function App(){

    return (
        <Router>
            <Switch>

                <Route exact path="/">
                    {()=>{
                        const all_key = jdb.read_key();
                        !all_key.length ? create_empty() : null;
                        const first_key = all_key[0];

                        return <Redirect to={`/edit/${first_key}`} />
                    }}
                </Route>

                <Route exact path='/to_first_data'>
                    {()=>{
                        const all_key = jdb.read_key();
                        !all_key.length ? create_empty() : null;
                        const first_key = all_key[0];
                        
                        return <Redirect to={`/edit/${first_key}`} />
                    }}
                </Route>
                
                <Route path='/redirect_to_edit/:id'
                render={(props)=>{
                    return <Redirect to={`/edit/${props.match.params.id}`}/>
                }} />

                <Route path='/edit/:id'
                render={(props)=>{
                    return <MainPage id={props.match.params.id} />
                }} />

            </Switch>
        </Router>
    );
}