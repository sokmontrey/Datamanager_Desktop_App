import React, {useEffect, useState, useCallback} from "react";
import { withRouter } from "react-router";

import { Data_Controller } from "../Controllers/DataController.js";
import { JSON_DB } from '../Controllers/DatabaseController.js';

const dc = new Data_Controller();
const jdb = new JSON_DB();

import { 
    CreateInputElement,
    Topbar
} from "../Components/Element.js";

class MainPage extends React.Component{
    constructor(props){
        super(props);

        dc.clean_data();

        const left_list = dc.get_left_list();
        
        const all_key = jdb.read_key();
        const index = all_key.indexOf(props.id);

        this.id = props.id;
        this.left_list = left_list;
        this.all_key = all_key;
        this.index = index;

        this.state = {
            data: jdb.read_json(props.id),
			img_path: jdb.read_img(props.id) || '',

            tab: left_list[0],
            leftExpand: false,

			next_key: index===all_key.length-1?'':all_key[index+1],
            previous_key: index===0?'':all_key[index-1],
        }
    }

    setTab (tab) { this.setState({ tab: tab }); }
    setData (new_data) { this.setState({ data: new_data }); }
    setLeftExpand(){ this.setState({ leftExpand: !this.state.leftExpand }); }
    forceUpdate(){ this.setState({}); }
	setImgPath(new_img_path){ this.setState({ img_path: new_img_path }) }

    SaveData(){
        // const id = this.id;
        // const data = this.state.data;
        jdb.update(this.id, this.state.data, '');
    }
    OnInputChange(value, key, index){
        const new_data = this.state.data;
        // const tab = this.state.tab;

        if(Array.isArray(new_data[this.state.tab])) 
            new_data[this.state.tab][index][key] = value;
        else new_data[this.state.tab][key] = value;

        const [cal, working] = dc.use_formula(new_data, this.state.tab);
        if(working) this.setData(cal)
        else { this.setData(new_data); }
        this.SaveData();
    }
    PushList(){
        const new_data = this.state.data;
        // const tab = this.state.tab;

        new_data[this.state.tab].push(dc.get_list_template(this.state.tab));
        this.setData(new_data);
        this.SaveData();
    }
    PopList(index){
        const new_data = this.state.data;
        // const tab = this.state.tab;

        new_data[this.state.tab].splice(index, 1);
        this.setData(new_data);
        this.SaveData();
    }
    LeftContainer(){
        // const left_list = this.left_list;
        // const tab = this.state.tab;

        const LeftButtonList = this.left_list.map((key, index)=>
            <button 
            key = {`${key}-${index}`}
            className = {`${key===this.state.tab?'selected-tab':''} button3 khmer`}
            onClick = {()=>{this.setTab(key)}}>
                {key}
            </button>
        );
        return ( <div id='left-container' 
        style={{flex:this.state.leftExpand?7:1.2}}> {/*expand style*/}

			{/* create a element with className='profile-picture' take take an image path and display it */}
            <img className='profile-picture' src={this.state.img_path} />

			<input type='file'
			accept='image/*'
			className='profile-input' 
			onChange={(e)=>{
				const file = e.target.files[0];
				const img_path = file.path;
				jdb.write_img(this.id, img_path);
				this.setImgPath(img_path);
			}}/>

            <div id='left-button-container'>
                {LeftButtonList}
            </div>

            {/* a button that when click, it expand left panel */}
            <button className="button3 left-expand-button"
            onClick={()=>{
                this.setLeftExpand();
            }}>
                <i className={`fi fi-rr-arrow-small-${
                    this.state.leftExpand?'left':'right'
                } icon`} />
            </button>

        </div> );
    }
    CreateRightBlock(element, index){
        // element: TAB: { 
        //      key: '', value: '' 
        // }
        // const tab = this.state.tab;
        const list = [];
        for(let key in element) list.push(key);

        const RightBlock = list.map((key, sub_index)=>
            <div key={`${this.state.tab}-${key}-${sub_index}`}
            className='khmer label-input-container'>
                <p className='right-label'>{key}</p>

                <CreateInputElement 
                    type = {dc.get_input_type(this.state.tab, key)}
                    value = {element[key]}
                    onChange = {(value)=>{
                        this.OnInputChange(value, key, index);
                    }}
                    onInsert = {(value)=>{
                        dc.insert_select_element(this.state.tab, key, value);
                        this.forceUpdate();
                    }}
                />
            </div>
        );
        return ( <div id='right-block-container'>
            {RightBlock}
        </div> );
    }
    RightContainer(){
        // const tab = this.state.tab;
        const data = this.state.data[this.state.tab]

        const RightList = Array.isArray(data) 
        ? //if data is a list create multiple label-input block
        <div>
            {/* input-label list */}
            {data.map((items, index)=>
                <div key={index} 
                className='label-input-block'
                style={{
                    borderBottom: index===data.length-1
                    ?''
                    :'0.12rem solid var(--light-primary-color)'
                }}>
                    {this.CreateRightBlock(items, index)}

                    {/* button that decrement the list */}
                    <button className='delete-button' 
                        style={{
                            visibility: data.length-1
                            ?'visible':'hidden'
                        }}
                        onClick={()=>{
                            this.PopList(index)
                        }}>
                        {/* Delete */}
                        <i className="fi fi-rr-trash icon" />
                    </button>
                </div>
            )}

            {/* button that increment the list */}
            <button className='button2'
                onClick={()=>{
                    this.PushList()
                }}>

                <i className="fi fi-rr-plus-small icon" />
                add
            </button>
        </div>
        : 
        <div>
            {this.CreateRightBlock(data, 0)}
        </div>
			

        return ( <div id='right-container'>
            {RightList}
        </div> );
    }
    NewData(){
        const hash_id = dc.create_empty();
        if(hash_id) {
            this.props.history.push( `/redirect_to_edit/${hash_id}` );
        }
        //TODO: create a better create handler 
        //also two function below
    }
    NextData(){
        // const next_key = this.state.next_key;
        if(this.state.next_key) {
            this.props.history.push(`/redirect_to_edit/${this.state.next_key}`);
        }
        
    }
    PreviousData(){
        // const previous_key = this.state.previous_key;
        if(this.state.previous_key) {
            this.props.history.replace(`/redirect_to_edit/${this.state.previous_key}`);
        }
    }
    DeleteData(){
        if(confirm('Are you sure you want to delete this data?')){
            // const id = this.id;   
            if(jdb.delete(this.id)){
                this.props.history.push('/to_first_data');
            }
        }
    }
    ToFirst(){
        const key = this.all_key[0];
        this.props.history.push(`/redirect_to_edit/${key}`);
    }
    ToLast(){
        const key = this.all_key[this.all_key.length-1];
        this.props.history.push(`/redirect_to_edit/${key}`);
    }
    render(){
        return (<div id='mainpage-container'>
            <Topbar 
            key_ratio={`${this.index+1}/${this.all_key.length}`}
            isAtStart={this.state.previous_key===''}
            isAtEnd={this.state.next_key===''}

            onNew={()=>{this.NewData()}}
            onNext={()=>{this.NextData()}}
            onPrevious={()=>{this.PreviousData()}}
            onDelete={()=>{this.DeleteData()}}
            
            onFirst={()=>{this.ToFirst()}}
            onLast={()=>{this.ToLast()}} />

            <div id='body-container'>
                {this.LeftContainer()}
                {this.RightContainer()}
            </div>

            <i className='fi fi-rr-key icon' 
            id='show-key-icon'>            
                <p id='hash_id-text'>{this.id}</p>
            </i>
        </div>);
    }

}

export default withRouter(MainPage);
