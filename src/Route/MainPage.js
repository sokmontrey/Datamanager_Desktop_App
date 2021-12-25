import React from "react";
import { withRouter } from "react-router";

import { 
    get_json_data,
    get_left_list,
    get_input_type,
    get_list_template,
    get_all_key,
    
    use_formula,
    create_empty,
    clean_data,

    update_data,
    insert_select_element,
    delete_data,
} from "../Controllers/DataController.js";

import { 
    CreateInputElement,
    Topbar, 
    DeletePanel
} from "../Components/Element.js";

class MainPage extends React.Component{
    constructor(props){
        super(props);

        const left_list = get_left_list();
        
        const all_key = get_all_key();
        const index = all_key.indexOf(props.id);

        this.state = {
            id: props.id,
            data: get_json_data(props.id),

            left_list: left_list,
            tab: left_list[0],
            leftExpand: false,

            all_key: all_key,
            index: index,
            next_key: index===all_key.length-1?'':all_key[index+1],
            previous_key: index===0?'':all_key[index-1],
        }
    }

    componentDidMount(){
        clean_data();//TODO also here
    }

    setTab (tab) { this.setState({ tab: tab }); }
    setData (new_data) { this.setState({ data: new_data }); }
    setLeftExpand(){ this.setState({ leftExpand: !this.state.leftExpand }); }
    forceUpdate(){ this.setState({}); }

    SaveData(){
        const id = this.state.id;
        const data = this.state.data;
        update_data(id, data, '');
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
    LeftContainer(){
        const left_list = this.state.left_list;
        const tab = this.state.tab;

        const LeftButtonList = left_list.map((key, index)=>
            <button 
            key = {`${key}-${index}`}
            className = {`${key===tab?'selected-tab':''} button3 khmer`}
            onClick = {()=>{this.setTab(key)}}>
                {key}
            </button>
        );
        return ( <div id='left-container' 
        style={{flex:this.state.leftExpand?7:1.2}}> {/*expand style*/}

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
        const tab = this.state.tab;
        const list = [];
        for(let key in element) list.push(key);

        const RightBlock = list.map((key, sub_index)=>
            <div key={`${tab}-${key}-${sub_index}`}
            className='khmer label-input-container'>
                <p className='right-label'>{key}</p>

                <CreateInputElement 
                    type = {get_input_type(tab, key)}
                    value = {element[key]}
                    onChange = {(value)=>{
                        this.OnInputChange(value, key, index);
                    }}
                    onInsert = {(value)=>{
                        insert_select_element(tab, key, value);
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
        const tab = this.state.tab;
        const data = this.state.data[tab]

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
        : //if data is not a list create a single label-input block
        <div>
            {this.CreateRightBlock(data, 0)}
        </div>

        return ( <div id='right-container'>
            {RightList}
        </div> );
    }
    NewData(){
        const hash_id = create_empty();
        if(hash_id) {
            this.props.history.push( `/redirect_to_edit/${hash_id}` );
        }
        //TODO: create a better create handler 
        //also two function below
    }
    NextData(){
        const next_key = this.state.next_key;
        if(next_key) {
            this.props.history.push(`/redirect_to_edit/${next_key}`);
        }
        
    }
    PreviousData(){
        const previous_key = this.state.previous_key;
        if(previous_key) {
            this.props.history.replace(`/redirect_to_edit/${previous_key}`);
        }
    }
    DeleteData(){
        if(confirm('Are you sure you want to delete this data?')){
            const id = this.state.id;   
            if(delete_data(id)){
                this.props.history.push('/to_first_data');
            }
        }
    }
    ToFirst(){
        const key = this.state.all_key[0];
        this.props.history.push(`/redirect_to_edit/${key}`);
    }
    ToLast(){
        const key = this.state.all_key[this.state.all_key.length-1];
        this.props.history.push(`/redirect_to_edit/${key}`);
    }

    render(){
        return (<div id='mainpage-container'>
            <Topbar 
            key_ratio={`${this.state.index+1}/${this.state.all_key.length}`}
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
                <p id='hash_id-text'>{this.state.id}</p>
            </i>
        </div>);
    }

}

export default withRouter(MainPage);