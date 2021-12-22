import React, { useState, useEffect } from 'react';

export function CreateInputElement(props){
    const [value, setValue] = useState(props.value);
    const type = props.type;

    useEffect(()=>{
        setValue(props.value);
    }, [props.value]);

    if(Array.isArray(type))
        return SELECT_TypeInput(list, value, setValue, props);
    else if(type === 'DATE')
        return Date_TypeInput(value, setValue, props);
    else if(type === 'CAL')
        return CAL_TypeInput(value);
    else
        return TEXT_TypeInput(value, setValue, props);
}

function CAL_TypeInput(value){
    return ( <p className='cal-input'>
    {value} </p>);
}
function TEXT_TypeInput(value, setValue, props){
    return( <input className='text-input'
        type = "text"
        value = {value} 
        onChange = {(e)=>{
            setValue(e.target.value)
            props.onChange(e.target.value)
        }}
    /> );
}
function Date_TypeInput(value, setValue, props){
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