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

const settings = {
  infinite: true,
  speed: 350,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

const SliderTambienTePuedeInteresar = () => {
    const [ultimaBusqueda, setUltimaBusqueda] = useState([]);
    const [sesionCerrada, setSesionCerrada] = useState(false);

    useEffect(() => {
      axios.get('/ultimaBusqueda')
      .then((response) => {
        console.log("Ultima busqueda response: ", response.data)
        setUltimaBusqueda(response.data);
      })
      .catch((error) => {
        console.log("Error al obtener la ultima busqueda: ", error)
        if (error.response.data.error== "Usuario no autenticado"){
          setSesionCerrada(true);
        }
      });
    }, []);
    const [productosTambienTePuedeInteresar, setProductosTambienTePuedeInteresar] = useState([]);

    useEffect(() => { 
      console.log("Ultima busqueda: ", ultimaBusqueda)
      if(ultimaBusqueda.texto_buscado != undefined && ultimaBusqueda.texto_buscado != null){
        axios.post("/tambienTePuedeInteresar",
        { 
            textBusqueda: ultimaBusqueda.texto_buscado, 
            categoriaBusqueda: ultimaBusqueda.categoria, 
            fPrecio: ultimaBusqueda.filtro_Precio, 
            fOfertantes: ultimaBusqueda.filtro_Ofertantes, 
            fTiempo: ultimaBusqueda.filtro_TiempoRestante, 
            fComprarAhora: ultimaBusqueda.filtro_ComprarAhora
        })
        .then((response) => {
            console.log("Response interesar: ", response.data);
            setProductosTambienTePuedeInteresar(response.data);
        })
        .catch((error) => {
          console.log("Error al obtener la ultima busqueda: ", error)
          if (error.response.data.error== "Usuario no autenticado"){
            setSesionCerrada(true);
          }
        });
      }
  }, [ultimaBusqueda]);

  return (
    <div className="slider-container">
      {productosTambienTePuedeInteresar.length >= 3 ? (
        <Slider {...settings}>
          {productosTambienTePuedeInteresar.map((resultado, index) => (
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
          <Label tipoLbl="lblTitulo" textoLbl="Lo sentimos :( Aún tenemos que conocerte mejor. Cuando lo hagamos podrás ver más contenido aquí." />
        </div>
      )}
      {sesionCerrada && (
        <ModalSesionCerrada/>
      )}
    </div>
  )
}

export default SliderTambienTePuedeInteresar;