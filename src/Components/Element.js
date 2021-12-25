import React, { useState, useEffect } from 'react';

export function CreateInputElement(props){
    const [value, setValue] = useState(props.value);
    const type = props.type;

    useEffect(()=>{
        setValue(props.value);
    }, [props.value]);

    if(Array.isArray(type)){
        const [focus, setFocus] = useState(false);

        return ( <div className='select-input-container'
        onFocus={()=>{setFocus(true)}}
        onBlur={()=>{setFocus(false)}}>

            {SELECT_TypeInput(type, value, setValue, props)}

            <CreateInsertSelect
            focus={focus}
            setFocus={setFocus}
            onInsert={(value)=>{
                props.onInsert(value);
            }}/>

        </div>);
    }else if(type === 'DATE'){
        return DATE_TypeInput(value, setValue, props);
    }else if(type === 'DISPLAY'){
        return DISPLAY_TypeInput(value);
    }else{
        return TEXT_TypeInput(value, setValue, props);
    }
}

function CreateInsertSelect(props){
    const [value, setValue] = useState(''); 

    return (<div className='insert-select-container'
    style={{ width: props.focus?'100%':'0%' }}>

        <input className='text-input khmer select-insert-input' 
        placeholder='insert...'
        type='text'
        value={value}
        onFocus={()=>{ props.setFocus(true) }}
        onBlur={()=>{ props.setFocus(false) }}
        onChange={(e)=>{
            setValue(e.target.value);
        }} />

        <button className='button3'
        onClick={()=>{
            if(value){ 
                props.onInsert(value); 
                setValue('');
            }
        }}>
            <i className='fi fi-rr-plus-small icon' />
        </button>

    </div>);
}

function DISPLAY_TypeInput(value){
    return ( <p className='display-input'>
    {value} </p>);
}
function TEXT_TypeInput(value, setValue, props){
    return( <input className='text-input khmer'
        placeholder = '___'
        type = "text"
        value = {value} 
        onChange = {(e)=>{
            setValue(e.target.value)
            props.onChange(e.target.value)
        }}
    /> );
}
function DATE_TypeInput(value, setValue, props){
    return( <input className='date-input'
        type = "date"
        value = {value} 
        onChange = {(e)=>{
            setValue(e.target.value)
            props.onChange(e.target.value)
        }}
    /> );
}
function SELECT_TypeInput(list, value, setValue, props){
    return( <select className='select-input'
        value = {value} 
        onChange = {(e)=>{
            setValue(e.target.value)
            props.onChange(e.target.value)
        }} >

        {list.map((item, index)=>
            <option key={`${item}-${index}`}
            className='option'>
                {item}
            </option>
        )}
    </select> );
}
export function Topbar(props){

    return (<div id='topbar-container'>
        <div id='topleft'>
            <button className='button2'
            onClick={props.onSearch}>
                <i className="fi fi-rr-search icon" />
                Search
            </button>
        </div>

        <div id='topright'>
            <p id='keytolength-ratio-text'>{props.key_ratio}</p>

            <button className='button2' disabled={props.isAtStart}
            onClick={props.onFirst}>
                <i className="fi fi-rr-angle-double-small-left icon" />
            </button>

            <button className='button2' disabled={props.isAtStart}
            onClick={props.onPrevious}>
                <i className="fi fi-rr-angle-small-left icon" />
                {/* previous */}
            </button>

            <button className='button2' disabled={props.isAtEnd}
            onClick={props.onNext}>
                <i className="fi fi-rr-angle-small-right icon" />
                {/* next */}
            </button>

            <button className='button2' disabled={props.isAtEnd}
            onClick={props.onLast}>
                <i className="fi fi-rr-angle-double-small-right icon" />
            </button>

            <button className='button2'
            onClick={props.onNew}>
                <i className="fi fi-rr-plus-small icon" />
            </button>

            <button className='button3 delete-button'
            onClick={props.onDelete}>
                <i className="fi fi-rr-trash icon" />
            </button>
        </div>
    </div>)
}
