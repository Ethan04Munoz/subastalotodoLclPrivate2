import React from 'react';
import './InputText.css'
const InputEmail = (props) => {
    return (
        <input name={props.name} className={props.clase} required type="email" placeholder={props.placeholder} onChange={props.onChange} onInput={props.evento}/>
    )
}

export default InputEmail;