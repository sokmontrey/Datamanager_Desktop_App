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

    write(data, img_path){
        try{
            const hash_id = sha1(Date.now())
            let final_data = {};
            final_data[hash_id] = data;

            fs.writeFileSync(path.join(database_path,`database/data/${hash_id}.json`), JSON.stringify(final_data));
            this.write_img(hash_id, img_path);
            return this.write_key(hash_id, data) 
        } catch (err) { console.log(err); return err; }
    }

    write_key(hash_id, old_data){
        const key_path = path.join(database_path, 'database/key/key.json');
        try{
            let first_index;
            for( let i in old_data ){
                first_index = i;
                break;
            } 
            const highlight = {}
            for( let i in old_data[first_index] ){
                highlight[i] = old_data[first_index][i];
            }
            if (!fs.existsSync(key_path))
                fs.writeFileSync(key_path, JSON.stringify({}));

            const data = JSON.parse(fs.readFileSync(path.join(database_path,`database/key/key.json`)))
            data[hash_id] = highlight;
            
            fs.writeFileSync(path.join(database_path,`database/KEY/key.json`), JSON.stringify(data));
        } catch (err) { return false; }
        return true;
    }

    write_structure(data){
        try{
            const structure_path =path.join(database_path, 'database/Structure/structure.json');
            fs.writeFileSync(structure_path, JSON.stringify(data));
            this.read_structure();
            return true;
        } catch (err) { return false; }
    }

    read_structure(){
        const structure_path = path.join(database_path,'database/Structure/structure.json');
        try{
            if (!fs.existsSync(structure_path)) return false;
            const data = JSON.parse(fs.readFileSync(structure_path));
            return data;
        } catch(err) { return false; }
    }

    read(hash_id){
        try{
            const data = JSON.parse(fs.readFileSync(path.join(database_path,`database/data/${hash_id}.json`)));
            return data;
        } catch(err) { console.log(err); return false; }
    }

    read_key(){
        const key_path = path.join(database_path,'database/KEY/key.json');
        try{
            if (!fs.existsSync(key_path)){
                fs.writeFileSync(key_path, JSON.stringify({}));
                return false;
            }

            const data = JSON.parse( fs.readFileSync(path.join(database_path,'database/KEY/key.json') ) );
            return data;
        } catch(err) { console.log(err); return false; }
    }

    update(hash_id, new_data, img_path){
        try{
            let final_data = {};
            final_data[hash_id] = new_data;

            fs.writeFileSync(path.join(database_path,`database/data/${hash_id}.json`), JSON.stringify(final_data));
            this.update_img(hash_id, img_path);
        } catch (err) { console.log(err);return false; }

        return this.update_key(hash_id, new_data);
    }

    update_key(hash_id, old_data){
        const key_path = path.join(database_path, 'database/KEY/key.json');
        try{
            let first_index;
            for( let i in old_data ){
                first_index = i;
                break;
            } 
            const highlight = {}
            for( let i in old_data[first_index] ){
                highlight[i] = old_data[first_index][i];
            }
            const data = JSON.parse(fs.readFileSync(key_path))
            data[hash_id] = highlight;
            
            fs.writeFileSync(key_path, JSON.stringify(data));
        } catch (err) { console.log(err);return false; }
        return true;
    }

    update_img(hash_id, img_path){
        try{
            fs.copyFileSync(img_path ,path.join(database_path,`database/Media/${hash_id}.png`));
        }catch(err){console.log(err);return false;}
        return true;   
    }

    delete_data(hash_id){
        try{
            fs.unlinkSync(path.join(database_path,`database/data/${hash_id}.json`));
            return this.delete_data_key(hash_id) && this.delete_img(hash_id);
        }catch(err){ return false; }
    }
    delete_data_key(hash_id){
        try{
            const data = JSON.parse( fs.readFileSync(path.join(database_path,'database/KEY/key.json') ));
            delete data[hash_id];
            fs.writeFileSync(path.join(database_path, 'database/Key/key.json'), JSON.stringify(data));
            return true;
        } catch (err) { return false; }
    }
    delete_img(hash_id){
        try{
            fs.unlinkSync(path.join(database_path, `database/Media/${hash_id}.png`));
            return true;
        } catch(err) { return false;} 
    }

    write_img(hash_id, img_path){
        try{
            fs.copyFileSync(img_path ,path.join(database_path,`database/Media/${hash_id}.png`));
        }catch(err){console.log(err);return false;}
        return true;        
    }

    read_img(hash_id){
        return path.join(database_path, `database/Media/${hash_id}.png`);
    }

}
