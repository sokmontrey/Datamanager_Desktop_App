import {JSON_DB as db} from './DatabaseController.js';

export function generate_data(is_edit, id){
    if(!is_edit){
        const data = {};
        db.get_schema().forEach(function(item){
            data[item.id] = item.default;           
        });
        return data;
    }else if(is_edit){
        return db.read_json(id);
    }
}