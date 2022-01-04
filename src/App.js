import React, {useState} from 'react';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import MainPage from './Route/MainPage.js';

import { Data_Controller } from './Controllers/DataController.js';
import { JSON_DB } from './Controllers/DatabaseController.js';

const jdb = new JSON_DB();
const dc = new Data_Controller();

export default function App(){
	dc.clean_data();
	return (
        <Router>
            <Switch>

                <Route exact path="/">
                    {()=>{
                        var all_key = jdb.read_key();
                        if(!all_key.length){
                            dc.create_empty();
                            all_key = jdb.read_key();
                        }
                        const first_key = all_key[0];
                        return <Redirect to={`/redirect_to_edit/${first_key}`} />
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
