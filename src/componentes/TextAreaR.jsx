import React, { useState, useRef } from 'react';
import './TextAreaR.css';
const TextAreaR = (props) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  function handleInput() {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 11}px`;
  }

  return (
    <textarea
    className={props.clase}
      ref={textareaRef}
      onChange={props.onChange}
      onInput={handleInput}
      style={{ resize: 'none' }}
      defaultValue={props.defaultValue}
    />
  );
}

export default TextAreaR;
