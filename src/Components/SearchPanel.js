import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import search_for_data, { get_search_highlight_list } from '../Controllers/SearchController.js';

export function SearchPanel(props) {
	if(props.display){
		const [result_list , setResultList] = useState([]);
		return ( <div 
			id='search-panel-outside-container'>

			<div id='search-panel-container'>
				<SearchTopbar 
					onSearchChange={(key1, key2, value)=>{
						setResultList(
							search_for_data(key1, key2, value)
						);
					}}
					{...props} />

				<SearchBody 
					{...props} 
					result_list={result_list} />
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
			onChange={(e)=>{
				props.onSearchChange(key1, key2, e.target.value);
			}}
			className='khmer search-input' 
			placeholder='Search for data...'/>
	</div>);
}

const SearchBody = (props)=>{
	const history = useHistory();

	const result_list = props.result_list;
	const ResultListEle = result_list.map((key, index)=>{
		const highlight_list = get_search_highlight_list(key);
		const HighlightEle = highlight_list.map((ele, sub_index)=>
			<p key={sub_index} className='search-highlight-text'>
				{ele}
			</p>
		);
		return ( <div 
			className='search-result-list-container' 
			key={index}> 

			<p style={{fontFamily: 'var(--secondary-font)'}}>{index+1}</p>

			<div 
				onClick={()=>{history.push(`/redirect_to_edit/${key}`)}}
				className='search-highlight-container khmer'>
				{HighlightEle}
			</div>

			<button className='button3'>
				<i className='fi fi-rr-trash icon'
					style={{color: 'red'}}/>
			</button>
		</div> )
	});
	return (<div id='search-body-container'>
		{ResultListEle}
	</div>)
}

