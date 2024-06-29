import React from 'react';
import './LinkMio.css';

const LinkMio = (props) => {
  return (
    <a target="_blank" className="Link" href={props.href}>
      {props.children}
    </a>
  );
};

export default LinkMio;
