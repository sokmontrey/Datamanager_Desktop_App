import React, { useState, useHistory, useEffect } from 'react';

export function SearchPanel(props) {
	if(props.display){
		return ( <div 
			id='search-panel-outside-container'>

			<div id='search-panel-container'>
				<SearchTopbar {...props} />
				<SearchBody />
			</div>
		</div> );
	}else return '';
}

const SearchTopbar = (props)=>{
	const schema = props.schema;
	const key1_list = [];
	for(let tab in schema)
		if(!Array.isArray(schema[tab])) key1_list.push(tab);

	const [key1, setKey1] = useState(key1_list[0]);
	const key1_option_ele = key1_list.map((k, index)=>
		<option key={index} value={k}>{k}</option>
	);

	const [key2, setKey2] = useState('');
	const [key2_option_ele, setKey2OptionEle] = useState(<></>);

	useEffect(()=>{
		const key2_list = [];
		for(let key in schema[key1]) key2_list.push(key);
		setKey2(key2_list[0]);

		setKey2OptionEle( 
			key2_list.map((key, index)=>
				<option key={index} value={key}>{key}</option>
			)
		);
	},[key1]);
	
	return (<div id='search-topbar-container'> 
		<button 
			className='button3'
			onClick={()=>{props.onClose()}}>
			<i className='fi fi-rr-cross-small icon' />
		</button>

		<p>key1: </p>
		<select 
			className='khmer search-filter-input'
			onChange={(e)=>{setKey1(e.target.value)}}>
			{key1_option_ele}
		</select>
		
		<p>key2: </p>
		<select 
			onChange={(e)=>{setKey2(e.target.value)}}
			className='khmer search-filter-input'>
			{key2_option_ele}
		</select>

		<input 
			className='khmer search-input' 
			placeholder='Search for data...'/>
	</div>);
}

const SearchBody = (props)=>{
	return (<div id='search-body-container'>
		
	</div>)
}

