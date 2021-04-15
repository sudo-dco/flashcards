import React from "react";
import axios from "axios";

const List = () => {

    return (
        <div className="card">
            <div className="card-header">
                All Questions
            </div>
            <ul className="list-group list-group-flush">
                {List}
            </ul>
        </div>
    )
};

export default List;