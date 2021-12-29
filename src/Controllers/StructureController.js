import * as fs from 'fs';
import * as path from 'path';

import process from 'process';
let database_path = '';

if(process.env.NODE_ENV === "development"){
    database_path = 'assets/';
}else{
    database_path = path.join(process.cwd(), 'resources/app/assets/');
}

export class Structure_DB{
    constructor(){}

    get_schema(){
        // schema_structure:{
        //     "Tab1": {
        //         "key": "value"
        //     },
        //     "Tab2":[{
        //         "key": "value"
        //     }]
        // }
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
        // formula_structure:{
        //     "Tab": {"key": "formula"}
        // }
        try{
            const formula = JSON.parse(
                fs.readFileSync(
                    path.join(database_path,
                    'database/structure/FORMULA.json')
                ) );
            return formula;
        }catch(e){ return false; }
    }
	get_math(){
		try{
			const math = new String(
				fs.readFileSync(
					path.join(database_path,
					'database/structure/MATH.js')
				)
			);
			if (math) return math;
			else return '';
		}catch (e) { return false; }
	}
    get_type(){
        // type_structure: {
        //     "Tab1": {
        //         "key": "TYPE"
        //     }
        // }
        try{
            const type = JSON.parse(
                fs.readFileSync(
                    path.join(database_path,
                    'database/structure/TYPE.json')
                ) );
            return type;
        }catch(e){ return false; }
    }
	get_highlight(){
		//highlight_structure: {
		//	"Tab": ["key1", "key2", "key3"]
		//}
		try{
			const highlight = JSON.parse(
				fs.readFileSync(
					path.join(database_path,
					'database/structure/HIGHLIGHT.json')
				)
			);
			return highlight;
		}catch(e){ return false; }
	}
    write_type(new_type){
        try{
            fs.writeFileSync(
                path.join(database_path,
                'database/structure/TYPE.json'),
                JSON.stringify(new_type)
            );
        } catch(e) { return false; }
    }
}
