import { JSON_DB } from './DatabaseController.js';
import { Structure_DB } from './StructureController.js';
import * as fuzz from 'fuzzball';

const jdb = new JSON_DB();
const sdb = new Structure_DB();

export default function search_for_data(key1, key2, pattern){
	const top = 10;
	const all_key = jdb.read_key();
	const ratio_list = [];
	for(let index=0; index<all_key.length; index++){
		const string = jdb.read_json(all_key[index])[key1][key2];
		ratio_list.push([fuzz.ratio(string, pattern), all_key[index]]);
	}
	ratio_list.sort(function(a, b){return b[0]-a[0]});
	const final_key_list = [];
	for(let index=0; index<top && index<ratio_list.length; index++){
		final_key_list.push(ratio_list[index][1]);
	}
	return final_key_list;
}

export const get_search_highlight_list = (key) => {
	const data = jdb.read_json(key);
	const highlight = sdb.get_highlight();
	const result = [];
	for(let tab in highlight){
		for(let index=0; index<highlight[tab].length; index++){
			result.push(data[ tab ][ highlight[tab][index] ] || '');
		}
	}
	return result;
}
