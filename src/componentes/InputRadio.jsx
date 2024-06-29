import React, { useState, useEffect } from 'react';
import './InputRadio.css'

const InputRadio = ({ onSelectionChange, onChangeProp, instantSalesParametro }) => {
  const [instantSales, setInstantSales] = useState(instantSalesParametro || false);
  //console.log("Instant sales: ", instantSales);

  // Si initialValue cambia, actualiza el estado instantSales
  useEffect(() => {
    setInstantSales(instantSalesParametro);
  }, [instantSalesParametro]);
  
  //console.log("Instant sales 2: ", instantSales);
  const handleOptionChange = () => {
    setInstantSales(!instantSales);
    onSelectionChange && onSelectionChange(!instantSales ? 'si' : 'no');
  };

  const handleOnChange = (event) => {
    handleOptionChange();
    onChangeProp && onChangeProp(event);
  };

  return (
    <div className="instant-sales-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={instantSales}
          onChange={handleOnChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default InputRadio;