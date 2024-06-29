import React from 'react';
import './InputText.css'
const InputTextBlur = (props) => {
    return (
        <input className={props.clase} required type="text" placeholder={props.placeholder} onBlur={props.onChange} defaultValue={props.defaultValue}/>
    )
}

export default InputTextBlur;