import React from 'react';
import './InputText.css'
const InputText = (props) => {
    return (
        <input name={props.name} className={props.clase} required type="text" placeholder={props.placeholder} onChange={props.onChange}/>
    )
}

export default InputText;