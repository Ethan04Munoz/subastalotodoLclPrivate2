    import React, { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import { useNavigate } from 'react-router-dom';
    import LblCentrado from './LblCentrado';
    import GhostBtn from './GhostBtn.jsx';
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
            <div className='filtrosComponenteBusqueda' key={JSON.stringify(params)} >
                {/* Precio Máximo */}
                <LblCentrado tipoLbl='lblCentrado' textoLbl='Precio máximo:' />
                <div className='inputAD'>
                    <button onClick={() => handleInput('fPrecio', parametrosBusqueda.fPrecio - 1)}>-</button>
                    <input
                        type="number"
                        value={parametrosBusqueda.fPrecio}
                        onInput={(e) => handleInput('fPrecio', parseInt(e.target.value))}
                    />
                    <button onClick={() => handleInput('fPrecio', parametrosBusqueda.fPrecio + 1)}>+</button>
                </div>

                {/* Cantidad de Ofertantes */}
                <LblCentrado tipoLbl='lblCentrado' textoLbl='Cantidad de ofertantes:' />
                <div className='inputAD'>
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
                <LblCentrado tipoLbl='lblCentrado' textoLbl='Tiempo restante:' />
                <div className='containerFiltros'>
                    <div>
                        <label className='lblCentrado' htmlFor='horas'>Horas</label>
                        <div className='inputAD'>
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
                        <label className='lblCentrado' htmlFor='minutos'>Minutos</label>
                        <div className='inputAD'>
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
                <LblCentrado tipoLbl='lblCentrado' textoLbl='Solo comprar ahora:' />
                <InputRadio onChangeProp={toggleComprarAhora} />
                <GhostBtn children='Aplicar filtros' onClick={buscarConFiltros} />
            </div>
        );
    }

    export default FiltrosComponenteBusqueda;
