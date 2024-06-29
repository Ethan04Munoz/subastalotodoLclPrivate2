import React, { useState, useEffect } from 'react';
import axios from '../paginas/axiosConfig.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css';
import Label from './LblCentrado.jsx';
import { getTopTenVendedores } from '../funcionesDB/get.js';

const NextArrow = ({ onClick }) => {
  return (
    <button className="arrow next" onClick={onClick}>
      {'>'}
    </button>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <button className="arrow prev" onClick={onClick}>
      {'<'}
    </button>
  );
};

const SliderComponent = () => {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    setVendedores(getTopTenVendedores());
  }, []);

  useEffect(() => {
    console.log("Vendedores: ", vendedores);
  }, [vendedores]);

  const settings = {
    infinite: true,
    speed: 350,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="slider-container">
      {vendedores.length >= 3 ? (
        <Slider {...settings}>
          {vendedores.map((resultado, index) => (
              <div key={index} className="slider-element">
                <a className='noTextDecoration' href={`/usuario/${resultado.username}`}>
                  <tr key={resultado.id} className='gridearRowsPerfilVendedor marginLeft10ProductosMasQueridos'> 
                    <td className='imgTablaPerfilVendedor1'>
                      <img src={resultado.rutaFotoPerfil} className='imgTablaPerfilVendedor'/> 
                    </td>
                    <td className='imgTablaPerfilVendedor3 '>
                      <div>
                        <p className='nombreProductoPerfilVendedor'>{resultado.username}</p>
                      </div>
                    </td>
                  </tr>
                </a>
              </div>
            ))}
        </Slider>
        ) : (
          <div className="formRegistro">
            <Label tipoLbl="lblTitulo" textoLbl="Ups! Parece que no tenemos nada que mostrarte por el momento :/ " />
          </div>
        )}
    </div>
  );
};

export default SliderComponent;
