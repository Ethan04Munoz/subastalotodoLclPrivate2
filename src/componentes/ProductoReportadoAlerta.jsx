import React from 'react';
import {Link} from 'react-router-dom';
import LblCentrado from './LblCentrado';
import './ProductoReportadoAlerta.css'

function ProductoReportadoAlerta(props){
    return(
        <div className='productoReportadoAlert'>
            <img src={props.img} alt="imagenProducto" />
            <LblCentrado
            tipoLbl="lblCentrado"
            textoLbl={props.nombreProducto}
            />
            <LblCentrado
            tipoLbl="lblCentrado"
            textoLbl={props.detallesProducto}
            />
            <Link className='LinkIns' to={props.direccionProducto}>Revisar producto</Link>
            <button>Eliminar producto</button> {/* Reemplazar por Ghost button */}
        </div>
    )

}

export default ProductoReportadoAlerta;