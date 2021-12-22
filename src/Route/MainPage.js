import React, { useState, useEffect } from "react";
import {
    update_data, 
    get_json_data,
    get_left_list,
    get_input_type,
    get_list_template,
    use_formula
} from "../Controllers/DataController.js";

import { CreateInputElement } from "../Components/Element.js";

export default class MainPage extends React.Component{
    constructor(props){
        super(props);

        const left_list = get_left_list();

        this.state = {
            id: props.id,
            data: get_json_data(props.id)[props.id],
            left_list: left_list,
            tab: left_list[0],
        }
    }

    setTab (tab) { this.setState({ tab: tab }); }
    setData (new_data) { this.setState({ data: new_data }); }

    SaveData(){
        const id = this.state.id;
        const data = this.state.data;
        update_data(id, data, '');
    }

    LeftContainer(){
        const left_list = this.state.left_list;
        const tab = this.state.tab;

        const LeftButtonList = left_list.map((key, index)=>
            <button 
            key = {`${key}-${index}`}
            className = {`button3 ${key===tab?'selected-tab':''}`}
            onClick = {()=>{this.setTab(key)}}>
                {key}
            </button>
        );
        return LeftButtonList;
    }

    OnInputChange(value, key, index){
        const new_data = this.state.data;
        const tab = this.state.tab;

        if(Array.isArray(new_data[tab])) 
            new_data[tab][index][key] = value;
        else new_data[tab][key] = value;

        const [cal, working] = use_formula(new_data, tab);
        if(working) this.setData(cal)
        else { this.setData(new_data); }
        this.SaveData();
    }

    PushList(){
        const new_data = this.state.data;
        const tab = this.state.tab;

        new_data[tab].push(get_list_template(tab));
        this.setData(new_data);
        this.SaveData();
    }

    PopList(index){
        const new_data = this.state.data;
        const tab = this.state.tab;

        new_data[tab].splice(index, 1);
        this.setData(new_data);
        this.SaveData();
    }

    CreateRightBlock(element, index){
        // element: TAB: { 
        //      key: '', value: '' 
        // }
        const tab = this.state.tab;
        const list = [];
        for(let key in element) list.push(key);

        const RightBlock = list.map((key, sub_index)=>
            <div key={`${tab}-${key}-${sub_index}`}>
                <p className='right-label'>{key}</p>

                <CreateInputElement 
                    type = {get_input_type(tab, key)}
                    value = {element[key]}
                    onChange = {(value)=>{
                        this.OnInputChange(value, key, index);
                    }}
                />
            </div>
        );
        return RightBlock;
    }

    RightContainer(){
        const tab = this.state.tab;
        const data = this.state.data[tab]

        const RightList = Array.isArray(data) 
        ? //if data is a list create multiple label-input block
        <div>
            {/* input-label list */}
            {data.map((items, index)=>
                <div key={index} 
                className='label-input-block'>
                    {this.CreateRightBlock(items, index)}

                    {/* button that decrement the list */}
                    <button style={{
                        visibility: data.length-1
                        ?'visible':'hidden'
                    }}
                    onClick={()=>{
                        this.PopList(index)
                    }}>Delete</button>
                </div>
            )}

            {/* button that increment the list */}
            <button className='button3'
            onClick={()=>{
                this.PushList()
            }}>Add</button>
        </div>
        : //if data is not a list create a single label-input block
        <div className='label-input-block'>
            {this.CreateRightBlock(data, 0)}
        </div>

        return RightList;
    }

    render(){
        return (<div id='mainpage-container'>
            {this.LeftContainer()}
            {this.RightContainer()}
        </div>);
    }

}