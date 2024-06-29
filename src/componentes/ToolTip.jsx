import React from 'react';
import './ToolTip.css';

function ToolTip(props) {
  return (
    <div className="tooltip">
      <span className="tooltiptext">{props.text}</span>
      {props.children}
    </div>
  );
}

export default ToolTip;
