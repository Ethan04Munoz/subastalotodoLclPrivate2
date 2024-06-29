import React, { useState, useEffect } from 'react';
import axios from '../paginas/axiosConfig.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css';
import Label from './LblCentrado.jsx';
import ModalSesionCerrada from '../ModalSesiónCerrada.jsx';

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

const SliderProductosMasQueridos = () => {
  const [productosMasQueridos, setProductosMasQueridos] = useState([]);
  const [sesionCerrada, setSesionCerrada] = useState(false);

  useEffect(() => {
    const fetchVendedores = async () => {
      console.log("Estas en fetchVendedores");
      axios.get('/productosMasQueridos')
      .then((response) => {
        console.log("Slider productos más queridos: ", response.data)
        setProductosMasQueridos(response.data);
      })
      .catch((error) => {
        console.log("Error al obtener la ultima busqueda: ", error)
        if (error.response.data.error== "Usuario no autenticado"){
          setSesionCerrada(true);
        }
      });
    };
    fetchVendedores();
  }, []);

  const settings = {
    infinite: true,
    speed: 350,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>
  };

  return (
    <div className="slider-container">
      {productosMasQueridos.length >= 3  ? (
        <Slider {...settings}>
        {productosMasQueridos.map((resultado, index) => (
          <div key={index} className="slider-element">
            <a className='noTextDecoration' href={`/producto/${resultado.id}`}>
              <tr key={resultado.id} className='gridearRowsPerfilVendedor marginLeft10ProductosMasQueridos'> 
                <td className='imgTablaPerfilVendedor1'>
                  <img src={resultado.imagen1Low} className='imgTablaPerfilVendedor'/> 
                </td>
                <td className='imgTablaPerfilVendedor2'>
                  {resultado.ultima_oferta == 0 ? (
                    <p className='precioPerfilVendedor'> <span className='letrapequeña'>desde </span> ${parseFloat(resultado.precio_minimo_aceptable) +1} </p>
                  ) : (
                    <p className='precioPerfilVendedor'> <span className='letrapequeña'>desde </span> ${resultado.ultima_oferta +1} </p>
                  )}
                </td>
                <td className='imgTablaPerfilVendedor3 '>
                  <div>
                    <p className='nombreProductoPerfilVendedor'>{resultado.nombre_producto}</p>
                    {/* Si los detalles tienen más de 50 caracteres, lo recortamos y añadimos ... al final
                    Si no, mostramos los detalles completos */}
                    <p className='detallesProductoPerfilVendedor'>{resultado.detalles.length > 50 ? resultado.detalles.substring(0, 50) + '...' : resultado.detalles}</p>
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
      {sesionCerrada && (
        <ModalSesionCerrada/>
      )}
    </div>
  );
};

export default SliderProductosMasQueridos;
