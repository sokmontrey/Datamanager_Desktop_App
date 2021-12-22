import { JSON_DB } from './DatabaseController.js';
import { Structure_DB } from './StructureController.js';
import { apply_math } from './MathController.js';

const jdb = new JSON_DB();
const sdb = new Structure_DB();

export function create_data(data, img_path){
    return jdb.create(data, img_path);
}

export function create_empty(){
    return create_data(sdb.get_schema(), '');
}

export function update_data(id, data, img_path){
    return jdb.update(id, data, img_path);
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

export function use_formula(data, tab){
    const formula = sdb.get_formula()[tab];
    if(!formula) return [null, false];//TODO use a better handler
    const new_data = data;
    var working = true;

    if(Array.isArray(data[tab])){
        // Tab: [{
        //     key: "Value"
        // },
        // {
        //     key: "Unit"
        // }]
        for(let index in data[tab]){
            for(let key in formula){
                [new_data[tab][index][key],
                working] = apply_math(data, tab, index, formula[key]);
            }
        }
    }else{
        // Tab: {
        //     key: "Value"
        // }
        for(let key in formula){
            [new_data[tab][key],
            working] = apply_math(data, tab, 0, formula[key]);
        }
    }
    return [new_data, working];
}