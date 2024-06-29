import React from 'react';
import GhostBtn2 from '../componentes/componentes/GhostBtn2.jsx';
import './componentes/SubHeader.css';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import {Link} from 'react-router-dom';
import { useState, useEffect} from 'react'; 
import HeaderConBarraEnlaces from '../componentes/componentes/HeaderConBarraEnlacesFiltros.jsx';
import { scrollTo } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig.js';
import SliderComponent from '../componentes/componentes/Slider.jsx';
import SliderProductosMasQueridos from '../componentes/componentes/SliderProductosMasQueridos.jsx';
import './MenuDeInicio.css';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from '../componentes/Metodos.js';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import SliderTambienTePuedeInteresar from '../componentes/componentes/SliderTambienTePuedeInteresar.jsx';

const MenuDeInicio = (props) => 
{
  const history = useNavigate();
  const [renderizar, setRenderizar] = useState("");
  useEffect(() => {
    axios.get('/validaciones/TipoUsuario')
    .then(response => {
      console.log("Validacion: ", response)
      if(response.data.tipoUsuario == 1){
        setRenderizar('Normal')
      } else if (response.data.tipoUsuario == 2){
        history("/init");
      } else if(response.data.tipoUsuario == 3){
        history('/editarperfilmod')
      } else{
        setRenderizar('NoEncontrada')
      }
    })
    .catch(error => {
      console.log(error.response);
      if (error.response && error.response.status === 401) {
        history('/login'); // Redirecciona al usuario a la página de inicio de sesión
      }
    });
  }, []);

    //Funcion para obtener la foto de perfil
    const [profileImagePath, setProfileImagePath] = useState(null);
    useEffect(() => {
      obtenerFotoPerfilGENERAL()
        .then(path => {
          setProfileImagePath(path);
        });
    }, []);

    const[linkPerfilPath, setlinkPerfilPath] = useState(null);
    useEffect(() => {
      obtenerLinkPerfil()
        .then(path => {
          setlinkPerfilPath(path);
        });
    }, []);

    const scrollPMQ = () => {
        scrollTo('#productosmasqueridos', {
          duration: 100,
          delay: 0,
          smooth: 'easeInOutQuart',
        });
      };

      const scrollLMV = () => {
        scrollTo('#losmejoresvendedores', {
          duration: 100,
          delay: 0,
          smooth: 'easeInOutQuart',
        });
      };

      const scrollTPI = () => {
        scrollTo('#tepuedeinteresar', {
          duration: 900,
          delay: 0,
          smooth: 'easeInOutQuart',
        });
      };

      function irAVender(event){
        event.preventDefault();
        history("publicarproducto");
      }

      if(renderizar== "Normal"){
        return(
            <div className='menuDeInicio'>
                <HeaderConBarraEnlaces
                title="Subastalotodo.com"
                img={profileImagePath}
                linkAlPerfil={linkPerfilPath}
                />
                {/* Subheader*/}
                <div className="subHeaderContenedor2">
                    <Link className='LinkFondoNaranja' to="#productosmasqueridos" onClick={scrollPMQ}>Productos más queridos</Link>
                    <Link className='LinkFondoNaranja' to="#losmejoresvendedores" onClick={scrollLMV}>Los mejores vendedores</Link>
                    <Link className='LinkFondoNaranja' to="#tepuedeinteresar" onClick={scrollTPI}>Te puede interesar</Link>
                </div>
                <div className='contenidoMenuDeInicio'>
                  <LblCentrado
                  id="productosmasqueridos"
                  tipoLbl="lblTitulo"
                  textoLbl="Productos más queridos"
                  />
                  <SliderProductosMasQueridos/>
                  <LblCentrado
                  id="losmejoresvendedores"
                  tipoLbl="lblTitulo"
                  textoLbl="Los mejores vendedores"
                  />
                  <SliderComponent/>
                  <LblCentrado
                  id="tepuedeinteresar"
                  tipoLbl="lblTitulo"
                  textoLbl="También te puede interesar"
                  />
                  <SliderTambienTePuedeInteresar/>
                  <GhostBtn2 clase="ghostBtnSecundario" children="Vender" onClick={irAVender}/>
                </div>      
            </div>
        )
      }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
      }
}

export default MenuDeInicio;