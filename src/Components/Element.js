import React, { useState, useEffect } from 'react';

export function CreateInputElement(props){
    const [value, setValue] = useState(props.value);
    const type = props.type;

    useEffect(()=>{
        setValue(props.value);
    }, [props.value]);

    if(Array.isArray(type))
        return SELECT_TypeInput(type, value, setValue, props);
    else if(type === 'DATE')
        return DATE_TypeInput(value, setValue, props);
    else if(type === 'DISPLAY')
        return DISPLAY_TypeInput(value);
    else
        return TEXT_TypeInput(value, setValue, props);
}

function DISPLAY_TypeInput(value){
    return ( <p className='display-input'>
    {value} </p>);
}
function TEXT_TypeInput(value, setValue, props){
    return( <input className='text-input khmer'
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
            <button className='button2'>
                <div className='search-icon icon' />
                Search
            </button>
        </div>
        <div id='topright'>
            <button className='button2'>
                <div className='icon back-icon'/>
                previous
            </button>
            <button className='button2'>
                <div className='icon next-icon'/>
                next
            </button>
            <button className='button2'>
                <div className='icon plus-icon'/>
                new
            </button>
            <button className='button3'>
                <div className='icon delete-icon' />
            </button>
        </div>
    </div>)
}
