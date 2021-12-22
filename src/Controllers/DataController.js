import {JSON_DB} from './DatabaseController.js';
import {Structure_DB} from './StructureController.js';

const jdb = new JSON_DB();
const sdb = new Structure_DB();

export function create_data(data, img_path){
    return jdb.create(data, img_path);
}

export function create_empty(){
    return create_data(sdb.get_schema(), '');
}

export function get_json_data(id){
    return jdb.read_json(id);
}

export function get_left_list(){
    const schema = sdb.get_schema();
    const list = [];
    for(let key in schema) list.push(key);
    return list;
}

export function get_list_template(tab){
    try{
        return sdb.get_schema()[tab][0];
    } catch (e) { console.log(e) }
}

export function get_input_type(tab, key){
    const type = sdb.get_type();
    //check if type has tab and key
    if(type[tab] && type[tab][key]) return type[tab][key];
    return 'TEXT';
}
