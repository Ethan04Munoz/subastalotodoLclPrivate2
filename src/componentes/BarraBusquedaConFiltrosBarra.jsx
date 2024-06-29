import React, { useState, useEffect } from 'react';
import './BarraBusqueda.css';
import 'bootstrap/dist/css/bootstrap.css';
import CategoriaLista from './CategoriaListaBarraBusqueda';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import InputRadio from './InputRadio';
import './Filtros.css';
import './InputText.css';
import { toNullIfZero } from './Metodos.js';

import GhostBtn from './GhostBtn.jsx';
function BarraBusquedaConFiltros(props) {
  const history = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas_las_categorias");
  function buscar(event){
    event.preventDefault();
    console.log("Redirigiendo");
    history(`/busqueda/${busqueda}/${categoria}/${null}/${null}/${null}/${null}`);
  }
  function guardarBusqueda(event){
    setBusqueda(event.target.value);
    console.log(busqueda);
  }

  function guardarCategoria(event){
    setCategoria(event.target.value);
    console.log(categoria);
  }

  const params = useParams();
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
      //console.log(parametrosBusqueda);
      // Convierte las horas a minutos y las suma a los minutos para el total de tiempo.
      const tiempoTotalEnMinutos = (parametrosBusqueda.fHoras * 60) + parametrosBusqueda.fMinutos;
      const tiempoTotalEnSegundos = tiempoTotalEnMinutos * 60;
      //console.log(`Tiempo total en minutos: ${tiempoTotalEnMinutos}\nTiempo total en segundos: ${tiempoTotalEnSegundos}`);

      const comprarAhoraNum = parametrosBusqueda.fComprarAhora ? 1 : 0;
      const urlParams = [
          busqueda,
          categoria,
          toNullIfZero(parametrosBusqueda.fPrecio),
          toNullIfZero(parametrosBusqueda.fOfertantes),
          toNullIfZero(tiempoTotalEnSegundos),
          comprarAhoraNum
      ];
      console.log("URL params: ", urlParams)
      history(`/busqueda/${urlParams.join('/')}`);
  };

  return (
    <>
        <form className='searchContainer'>
            <CategoriaLista claseDesplegable="selectListaDesplegableChica" onChange={guardarCategoria}/>
            <input className='input inputEnviarBarra' type="text" placeholder="Buscar en subastalotodo.com" onChange={guardarBusqueda}/>
            <button className='btnEnviarBarra' type="submit" onClick={buscar}>
                <i className="fa fa-search"></i>
            </button>
        </form>
        <div className='filtrosComponenteBusquedaEnBarra' key={JSON.stringify(params)} >
            {/* Precio Máximo */}
            <div className='filtrosB1 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra'>
                    Precio máximo:
                </p>
            </div> 
            <div className='filtrosB2 filtrosB gridTiempoInputs'>
                <input
                    type="number"
                    value={parametrosBusqueda.fPrecio}
                    onInput={(e) => handleInput('fPrecio', parseInt(e.target.value))}
                    className='input'
                />
            </div>

            {/* Cantidad de Ofertantes */}
            <div className='filtrosB3 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra'>
                    Cantidad de ofertantes: 
                </p>
            </div>
            <div className='filtrosB4 gridTiempoInputs filtrosB'>
                <input
                    type="number"
                    min={0}
                    max={5}
                    value={parametrosBusqueda.fOfertantes}
                    onInput={(e) => handleInput('fOfertantes', parseInt(e.target.value))}
                    className='input'
                />
            </div>
            {/* Tiempo Restante */}
            <div className='filtrosB5 filtrosB alignCenterFCBB'>
                <p className='textoLblFiltrosBarra tiempoRestante'>
                    Tiempo restante:
                </p>
                <p className='textoLblFiltrosBarra parrafoLabel1'>Horas</p>
                <p className='textoLblFiltrosBarra parrafoLabel2'>Minutos</p>
            </div>
            <div className='containerFiltros filtrosB6'>
                <div>
                    <div className='gridTiempoInputs'>
                        <input
                            type="number"
                            value={parametrosBusqueda.fHoras}
                            onInput={(e) => handleInput('fHoras', parseInt(e.target.value))}
                            className='input'
                        />
                    </div>
                </div>
                <div>
                    <div className='gridTiempoInputs'>
                        <input
                            type="number"
                            value={parametrosBusqueda.fMinutos}
                            onInput={(e) => handleInput('fMinutos', parseInt(e.target.value))}
                            className='input'
                        />
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
    </>
  );
}

export default BarraBusquedaConFiltros;
