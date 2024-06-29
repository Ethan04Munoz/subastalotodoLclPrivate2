import React from 'react';
import './GhostBtn.css'
const GhostBtn = (props) => {
    return (
        <button type='button' className="ghostBtn" onClick={props.onClick}>
        {props.children}
        </button>
    );
}

export default GhostBtn;