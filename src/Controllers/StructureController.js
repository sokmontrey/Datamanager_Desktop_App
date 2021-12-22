import * as fs from 'fs';
import * as path from 'path';

import process from 'process';
let database_path = '';

if(process.env.NODE_ENV === "development"){
    database_path = 'assets/';
}else{
    database_path = path.join(process.cwd(), 'resources/app/assets/');
}

export default class Structure_DB{
    get_schema(){
        try{
            const schema = JSON.parse(
                fs.readFileSync(
                    path.join(database_path, 
                    'database/structure/SCHEMA.json')
                ) );
            return schema;
        }catch(e){ return false; }
    }
    get_formula(){
        try{
            const formula = JSON.parse(
                fs.readFileSync(
                    path.join(database_path,
                    'database/structure/FORMULA.json')
                ) );
            return formula;
        }catch(e){ return false; }
    }
    get_type(){
        try{
            const type = JSON.parse(
                fs.readFileSync(
                    path.join(database_path,
                    'database/structure/TYPE.json')
                ) );
            return type;
        }catch(e){ return false; }
    }
}