import React from "react";

import Structure_DB from "../Controllers/StructureController.js";
import { generate_data } from "../Controllers/MainPageController.js";

export default function MainPage(props) {

    const page = props.page;
    const id = props.id;
    const data = generate_data(page==='edit', id);

    var schema, formula, type;
    try{
        schema = Structure_DB.get_schema();
        formula = Structure_DB.get_formula();
        type = Structure_DB.get_type();
    } catch (e) { return 'Unable to read Structure' }

    // TODO: Continue here
    return ( <div id='mainpage-container'>
        {LeftSide()}
    </div>);
}

function LeftSide(left_list) {
    return ( <div id='leftside-container'>

    </div> );
}