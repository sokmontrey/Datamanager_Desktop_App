import * as fs from 'fs';
import sha1 from 'sha1';
import * as path from 'path';

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
        this.write_key(hash_id);
        this.write_img(hash_id, img_path);
        return hash_id;
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

    write_key(id){
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

    write_img(id, img_path){
        try{
            fs.copyFileSync(
                img_path, 
                path.join(database_path,`database/Media/${id}.png`)
            );
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
        this.update_json(id, data);
        this.update_img(id, img_path);
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
