import React, { useState } from 'react';
import './BarraBusqueda.css';
import 'bootstrap/dist/css/bootstrap.css';
import CategoriaLista from './CategoriaListaBarraBusqueda';
import { useNavigate } from 'react-router-dom';

function SearchBar(props) {
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

  return (
    <form className='searchContainer'>
      <CategoriaLista claseDesplegable="selectListaDesplegableChica" onChange={guardarCategoria}/>
      <input className='input inputEnviarBarra' type="text" placeholder={props.placeholder} onChange={guardarBusqueda}/>
      <button className='btnEnviarBarra' type="submit" onClick={buscar}>
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}

export default SearchBar;
