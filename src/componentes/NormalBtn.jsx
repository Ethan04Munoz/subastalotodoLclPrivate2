import React from 'react';
import './NormalBtn.css'
const NormalBtn = (props) => {
    return (
        <button className="normalBtn" onClick={props.onClick}>
        {props.children}
        </button>
    );
}

export default NormalBtn;