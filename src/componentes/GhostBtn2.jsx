import React from 'react';
import './GhostBtn.css'
const GhostBtn2 = (props) => {
    return (
        <button type='button' className={props.clase} onClick={props.onClick} disabled={props.disabled}>
        {props.children}
        </button>
    );
}

export default GhostBtn2;