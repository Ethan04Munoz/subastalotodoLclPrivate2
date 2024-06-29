import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LblCentrado from './LblCentrado';
import GhostBtn from './GhostBtn.jsx';
import InputText from './InputText';
import axios from '../paginas/axiosConfig.js';
import InputRadio from './InputRadio';
import './Filtros.css';
import { toNullIfZero } from './Metodos.js';

function FiltrosComponenteBusqueda() {
    const params = useParams();
    const history = useNavigate();
    const [parametrosBusqueda, setParametrosBusqueda] = useState({
        fPrecio: 0,
        fOfertantes: 0,
        fHoras: 0,
        fMinutos: 0,
        fComprarAhora: false
    });

    useEffect(() => 
    {
        setParametrosBusqueda({
            fPrecio: 0,
            fOfertantes: 0,
            fHoras: 0,
            fMinutos: 0,
            fComprarAhora: false
        });
    }, [params]);
    

    const handleInput = (key, value) => {
        let newValue = value;
        if (key === 'fPrecio' && value < 0) {
            newValue = 0;  // Establecer el valor mínimo
        }
        if (key === 'fOfertantes' && (value < 0 || value > 5)) {
            newValue = value < 0 ? 0 : 5;
        }
        if (key === 'fHoras' && (value < 0 || value > 72)) {
            newValue = value < 0 ? 0 : 72;
        }
        if (key === 'fMinutos' && (value < 0 || value > 59)) {
            newValue = value < 0 ? 0 : 59;
        }
        setParametrosBusqueda({
            ...parametrosBusqueda,
            [key]: newValue
        });
    };

    const toggleComprarAhora = () => {
        setParametrosBusqueda({
            ...parametrosBusqueda, 
            fComprarAhora: !parametrosBusqueda.fComprarAhora
        });
    };    

    const buscarConFiltros = () => {
        console.log(parametrosBusqueda);
        // Convierte las horas a minutos y las suma a los minutos para el total de tiempo.
        const tiempoTotalEnMinutos = (parametrosBusqueda.fHoras * 60) + parametrosBusqueda.fMinutos;
        const tiempoTotalEnSegundos = tiempoTotalEnMinutos * 60;
        console.log(`Tiempo total en minutos: ${tiempoTotalEnMinutos}\nTiempo total en segundos: ${tiempoTotalEnSegundos}`);

        const comprarAhoraNum = parametrosBusqueda.fComprarAhora ? 1 : 0;
        const urlParams = [
            params.busqueda,
            params.categoria,
            toNullIfZero(parametrosBusqueda.fPrecio),
            toNullIfZero(parametrosBusqueda.fOfertantes),
            toNullIfZero(tiempoTotalEnSegundos),
            comprarAhoraNum
        ];
        history(`/busqueda/${urlParams.join('/')}`);
    };

    return (
        <div className='filtrosComponenteBusquedaEnBarra' key={JSON.stringify(params)} >
            {/* Precio Máximo */}
            <div className='filtrosB1 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra'>
                    Precio máximo:
                </p>
            </div> 
            <div className='filtrosB2 filtrosB gridTiempoInputs'>
                <button onClick={() => handleInput('fPrecio', parametrosBusqueda.fPrecio - 1)}>-</button>
                <input
                    type="number"
                    value={parametrosBusqueda.fPrecio}
                    onInput={(e) => handleInput('fPrecio', parseInt(e.target.value))}
                />
                <button onClick={() => handleInput('fPrecio', parametrosBusqueda.fPrecio + 1)}>+</button>
            </div>

            {/* Cantidad de Ofertantes */}
            <div className='filtrosB3 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra'>
                    Cantidad de ofertantes: 
                </p>
            </div>
            <div className='filtrosB4 gridTiempoInputs filtrosB'>
                <button onClick={() => handleInput('fOfertantes', parametrosBusqueda.fOfertantes - 1)}>-</button>
                <input
                    type="number"
                    min={0}
                    max={5}
                    value={parametrosBusqueda.fOfertantes}
                    onInput={(e) => handleInput('fOfertantes', parseInt(e.target.value))}
                />
                <button onClick={() => handleInput('fOfertantes', parametrosBusqueda.fOfertantes + 1)}>+</button>
            </div>
            {/* Tiempo Restante */}
            <div className='filtrosB5 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra'>
                    Tiempo restante:
                </p>
            </div>
            <div className='containerFiltros filtrosB6'>
                <div>
                    <p className='textoLblFiltrosBarra'>Horas</p>
                    <div className='gridTiempoInputs'>
                        <button onClick={() => handleInput('fHoras', parametrosBusqueda.fHoras - 1)}>-</button>
                        <input
                            type="number"
                            value={parametrosBusqueda.fHoras}
                            onInput={(e) => handleInput('fHoras', parseInt(e.target.value))}
                        />
                        <button onClick={() => handleInput('fHoras', parametrosBusqueda.fHoras + 1)}>+</button>
                    </div>
                </div>
                <div>
                    <p className='textoLblFiltrosBarra'>Minutos</p>
                    <div className='gridTiempoInputs'>
                        <button onClick={() => handleInput('fMinutos', parametrosBusqueda.fMinutos - 1)}>-</button>
                        <input
                            type="number"
                            value={parametrosBusqueda.fMinutos}
                            onInput={(e) => handleInput('fMinutos', parseInt(e.target.value))}
                        />
                        <button onClick={() => handleInput('fMinutos', parametrosBusqueda.fMinutos + 1)}>+</button>
                    </div>
                </div>
            </div>

            {/* Solo Comprar Ahora */}
            <div className='filtrosB7 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra'>Solo comprar ahora</p>
            </div>
            <div className='filtrosB8'>
                <InputRadio onChangeProp={toggleComprarAhora} />
            </div>
            <div className='filtrosB910'>
                <GhostBtn children='Buscar con filtros' onClick={buscarConFiltros} />
            </div>
        </div>
    );
}

export default FiltrosComponenteBusqueda;
