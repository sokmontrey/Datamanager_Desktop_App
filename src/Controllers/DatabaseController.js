import * as fs from 'fs';
import sha1 from 'sha1';
import * as path from 'path';
import xlsx from 'xlsx';

import process from 'process';
// const database_path = path.join(process.cwd(), 'resources/app/assets/');

let database_path = '';

if(process.env.NODE_ENV === "development"){
    database_path = 'assets/';
}else{
    database_path = path.join(process.cwd(), 'resources/app/assets/');
}

export class JSON_DB{
    constructor(){}

    create(data, img_path){
        const hash_id = sha1(Date.now());
        this.write_json(hash_id, data);
        this.insert_key(hash_id);
        this.write_img(hash_id, img_path);
        return hash_id;
    }

    create_sheet_from_tab(tab){
        //a function that take json and write it into xlsx
        //return the path of xlsx file
        try{
            const data = [];
            const all_key = this.read_key();
            for(let index=0; index<all_key.length; index++){
                const json_data = this.read_json(all_key[index])[tab];
                if(Array.isArray(json_data)){
                    for(let sub_index=0; sub_index<json_data.length; sub_index++){
                        json_data[sub_index]['no'] =sub_index+1;
                        json_data[sub_index]['hash_id'] = !sub_index
                        ?all_key[index]:'---';
                        data.push(json_data[sub_index]); 
                    }
                }else{
                    json_data['hash_id'] = all_key[index];
                    data.push(json_data);
                }
            }
            
            const ws = xlsx.utils.json_to_sheet(data);
            return ws;
        }catch(e) {return false;}
    }

    create_all_xlsx(schema){
        try{
            const date = Date.now();
            const xlsx_path = path.join(
                database_path, 
                `database/XLSX/${date}.xlsx`
            );

            const wb = xlsx.utils.book_new();
            for(let tab in schema){
                const ws = this.create_sheet_from_tab(tab);
                if(ws){
                    xlsx.utils.book_append_sheet(wb, ws, tab);
                }
            }
            xlsx.writeFile(wb, xlsx_path);
            console.log('write');
            return `${date}.xlsx`;
        }catch(e){return false;}
    }

    write_json(id, data){
        // data_structure:{
        //     id: {
        //         tab1: {key: value...},
        //         tab2: {key: value...}
        //     }
        // }
        try{
            const new_data = { [id]: data }
            fs.writeFileSync(
                path.join(database_path,`database/data/${id}.json`), 
                JSON.stringify(new_data)
            );
            return true;
        }catch(e){
            return false;
        }
    }

    insert_key(id){
        // key_structure: {
        //     key:[a,b,c]
        // }
        try{
            //check if key.json exists or not. if not create a key.json file   
            if(!fs.existsSync(path.join(database_path, 'database/KEY/key.json'))){
                fs.writeFileSync(
                    path.join(database_path, 'database/KEY/key.json'), 
                    JSON.stringify({key:[]})
                );
            }

            const old_key = JSON.parse( fs.readFileSync(path.join(database_path, 'database/KEY/key.json')) );
            old_key.key.push(id);
            fs.writeFileSync(path.join(database_path, 'database/KEY/key.json'), JSON.stringify(old_key));
            return true;
        }catch(e){ return false; }
    }

    write_key(key_list){
        try{
            //check if key.json exists or not. if not create a key.json file   
            if(!fs.existsSync(path.join(database_path, 'database/KEY/key.json'))){
                fs.writeFileSync(
                    path.join(database_path, 'database/KEY/key.json'), 
                    JSON.stringify({key:[]})
                );
            }

            const key = { key: key_list };
            fs.writeFileSync(path.join(database_path, 'database/KEY/key.json'), JSON.stringify(key));
            return true;
        }catch(e){ return false; }
    }

    write_img(id, img_path){
        try{
            fs.copyFileSync(
                img_path, 
                path.join(database_path,`database/Media/${id}.png`)
            );
			console.log("true", img_path);
            return true;
        }catch(e){ return false; }
    }

    read_key(){
        try{
            if(!fs.existsSync(path.join(database_path, 'database/KEY/key.json'))){
                fs.writeFileSync(
                    path.join(database_path, 'database/KEY/key.json'), 
                    JSON.stringify({key:[]})
                );
            }
            const key = JSON.parse(
                fs.readFileSync(
                    path.join(database_path, 'database/KEY/key.json')
                )
            );
            return key.key;
        }catch(e){ return false; }
    }

    read_json(id){
        // json that read: {
        //     "Tab": {} (no id)
        // }
        try{
            const data = JSON.parse(fs.readFileSync(path.join(database_path, `database/data/${id}.json`)));
            return data[id];
        }catch(e){ return false; }
    }

    read_img(id){
        try{
            const img_path = path.join(database_path, `database/Media/${id}.png`);
            return img_path;
        }catch(e){ return false; }
    }

    update(id, data, img_path){
        return this.update_json(id, data)
        && this.update_img(id, img_path);
    }

    update_json(id, data){
        // method read_json is for get the entire JSON File(include id:{})
        // but this update_json only take value inside id:{}
        try{
            const old_data = JSON.parse(fs.readFileSync(path.join(database_path, `database/data/${id}.json`)));
            old_data[id] = data;
            fs.writeFileSync(path.join(database_path, `database/data/${id}.json`), JSON.stringify(old_data));
            return true;
        }catch(e){ return false; }
    }

    update_img(id, img_path){
        try{
            fs.copyFileSync(img_path ,path.join(database_path,`database/Media/${id}.png`));
            return true;
        }catch(e){ return false; }
    }

    delete(id){
        this.delete_json(id);
        this.delete_img(id);
        return this.delete_key(id);
    }

    delete_key(id){
        try{
            const all_key = this.read_key();
            //all_key: [1,2,3]
            const new_key_list = all_key.filter(key => key !== id);
            this.write_key(new_key_list);
            return true;
        }catch(e){ return false; }
    }

    delete_json(id){
        try{
            fs.unlinkSync(path.join(database_path,`database/data/${id}.json`));
            return true;
        }catch(e){ return false; }
    }

    delete_img(id){
        try{
            fs.unlinkSync(path.join(database_path,`database/Media/${id}.png`));
            return true;
        }catch(e){ return false; }
    }
}
