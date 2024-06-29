import React, { useState } from 'react';
import './InputPassword.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const InputText = (props) => {
    const [inputType, setInputType] = useState('password');
    const [eyeIcon, setEyeIcon] = useState('bi bi-eye');

    const isEdge = /Edg/i.test(window.navigator.userAgent) || /Microsoft Edge/i.test(window.navigator.userAgent);

    const handleMouseDown = (event) => {
        event.preventDefault();
        setInputType('text');
        setEyeIcon('bi bi-eye-slash');
    }

    const handleMouseUp = (event) => {
        event.preventDefault();
        setInputType('password');
        setEyeIcon('bi bi-eye');
    }

    return (
        <div className="input-container">
            <input name={props.name} className={props.clase} required type={inputType} placeholder={props.placeholder} onChange={props.onChange} />
            {!isEdge && (
                <button type='button' className="show-password" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
                    <i className={eyeIcon}></i>
                </button>
            )}
        </div>
    );
}

export default InputText;
