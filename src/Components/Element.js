import React, { useState, useEffect } from 'react';

export function ConfirmDialog(message, onYes, onNo){
	return ( <div className='dialog-wrapper'>
		<div className='dialog-container'>
			<p className='dialog-text'>{message}</p>
			<button className='button2'
				onClick={()=>onYes()}>Yes</button>
			<button className='button2'
				onClick={()=>onNo()}>No</button>
		</div>
	</div> )
}
export function AlertDialog(message, onClose){
	return ( <div className='dialog-wrapper'>
		<div className='dialog-container'>
			<p className='dialog-text'>{message}</p>
			<button className='button2' 
				onClick={()=>onClose()}>Close</button>
		</div>
	</div> );
}
export function PromptDialog(message, onSubmit, onClose){
	const [value, setValue] = useState('');
	return (<div className='dialog-wrapper'>
		<div className='dialog-container'>
			<p className='dialog-text'>{message}</p>
			<input className='text-input khmer'
				placeholder='Input...'
				type='text'
				onChange={(e)=>{
					setValue(e.target.value);
				}} 
				value={value}/>
			<button className='button1'
				onClick={()=>{onSubmit(value)}}>
				Submit
			</button>
			<button className='button2'
				onClick={()=>onClose()}>Close</button>
		</div>
	</div>);
}

export function CreateInputElement(props){
    const [value, setValue] = useState(props.value);
    const type = props.type;

    useEffect(()=>{
        setValue(props.value);
    }, [props.value]);

    if(Array.isArray(type)){
		return ( <div className='select-input-container'>

            {SELECT_TypeInput(type, value, setValue, props)}

			<button 
				className='button3'
				onClick={()=>{}}>
				<i className='fi fi-rr-plus-small icon' />
			</button>

        </div>);
    }else if(type === 'DATE'){
        return DATE_TypeInput(value, setValue, props);
    }else if(type === 'DISPLAY'){
        return DISPLAY_TypeInput(value);
    }else{
        return TEXT_TypeInput(value, setValue, props);
    }
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
            
        <option className='option' value=''>
            {'Select...'}
        </option>

        {list.map((item, index)=>
            <option key={`${item}-${index}`}
            className='option'
            value={item}>
                {item}
            </option>
        )}
    </select> );
}
export function Topbar(props){

    return (<div id='topbar-container'>
        <div id='topleft'>
			<button className='button2 down-button'
			onClick={props.onSaveXlsx}>
				<i className='fi fi-rr-arrow-small-down icon' />
			</button>

            <button className='button2'
            onClick={props.onSearch}>
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
