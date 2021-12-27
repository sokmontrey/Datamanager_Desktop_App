class math_function{
    NOW(){ 
        const result = new Date();
        const day = result.getDate();
        const month = result.getMonth() + 1;
        const year = result.getFullYear();
        return `${day}-${month}-${year}`;
    }
    YEAR(date){
        if(date.split('-').length === 3){
            return date.split('-')[2];
        }else if(date.split('/').length === 3){
            return date.split('/')[2];
        }
    }
    MONTH(date){
        if(date.split('-').length === 3){
            return date.split('-')[1];
        }else if(date.split('/').length === 3){
            return date.split('/')[1];
        }
    }
    DAY(date){
        if(date.split('-').length === 3){
            return date.split('-')[0];
        }else if(date.split('/').length === 3){
            return date.split('/')[0];
        }
    }
    INT(string){ return parseInt(string); }
    STR(int){ return int.toString(); }
}
export function apply_math(data, tab, index, formula){
    // formula is String
    try{
        const f = new math_function();
        const splited_variable = split_variable(formula);
        const replaced = find_variable(splited_variable, data, tab, index).join('');
        const result = eval(replaced);
        // var result = '';
        // for(let i in replaced){
        //     if(!(i % 2)) result += eval(replaced[i])? eval(replaced[i]) : '';
        //     else result += replaced[i];
        // }
        return [result, true];
    } catch (e) { return [e.message, false] }
}
function split_variable(string){
    //ex: "YEAR(NOW()) - YEAR([date of birth]) + ' years'"
    // -> "YEAR(NOW()) - YEAR(" , "~vdate of birth",") +' years'"
    const start = string.split('[');
    const end = [];
    for(let index in start){
        const splited = start[index].split(']');
        if(splited.length <= 1){
            end.push(start[index]);
        } else {
            end.push("~v" + splited[0]);
            end.push(splited[1]);
        }
    }
    return end;
}
function find_variable(splited, data, tab, index){
    //ex: "YEAR(NOW()) - YEAR(" , "~vdate of birth",") +'years'"
    // -> "YEAR(NOW()) - YEAR(" , "replaced",") +'years'"
    const new_splited = [];
    for(let i in splited){
        if(splited[i].startsWith("~v")){
            const key = splited[i].replace("~v", "");
            const splited_key = key.split(':');
            if(splited_key.length === 1){
                if(Array.isArray(data[tab]))
                    new_splited.push(data[tab][index][key]);
                else
                    new_splited.push(data[tab][key]);
            }else if (splited_key.length === 2){
                const new_tab = splited_key[0];
                const new_key = splited_key[1];
                if(Array.isArray(data[new_tab]))
                    new_splited.push(data[new_tab][index][new_key]);
                else
                    new_splited.push(data[new_tab][new_key]);
            }
            if(new_splited[i].split('-').length===3){
                new_splited[i] = convert_date(new_splited[i]);
            }
        }else{
            new_splited.push(splited[i]);
        }
    }
    return new_splited;
}
function convert_date(date){
    //local date string: yyyy/mm/dd  
    const splited = date.split('-');
    const year = splited[0];
    const month = splited[1];
    const day = splited[2];
    return `${day}-${month}-${year}`;
} 