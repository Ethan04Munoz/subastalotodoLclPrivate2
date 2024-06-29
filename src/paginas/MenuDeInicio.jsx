import React from 'react';
import GhostBtn2 from '../componentes/GhostBtn2.jsx';
import '../componentes/SubHeader.css';
import LblCentrado from '../componentes/LblCentrado.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import {Link} from 'react-router-dom';
import { useState, useEffect} from 'react'; 
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlacesFiltros.jsx';
import { scrollTo } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import SliderComponent from '../componentes/Slider.jsx';
import SliderProductosMasQueridos from '../componentes/SliderProductosMasQueridos.jsx';
import './MenuDeInicio.css';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import SliderTambienTePuedeInteresar from '../componentes/SliderTambienTePuedeInteresar.jsx';
import { getLinkPerfil, getObtenerFotoPerfilGeneral, getValidacionesTipoUsuario } from '../funcionesDB/get.js';

const MenuDeInicio = (props) => 
{
  const history = useNavigate();
  const [renderizar, setRenderizar] = useState("");
  useEffect(() => {
      let tipoUsuario = getValidacionesTipoUsuario();
      console.log("Tipo: ", tipoUsuario, tipoUsuario=="Normal");
      if(tipoUsuario == "Normal"){
        setRenderizar('Normal')
      } else if (tipoUsuario == "Mod"){
        history("/init");
      } else if(tipoUsuario == ("ModSinVerificar")){
        history('/editarperfilmod')
      } else{
        setRenderizar('NoEncontrada')
      }
  }, []);

    //Funcion para obtener la foto de perfil
    const [profileImagePath, setProfileImagePath] = useState(null);
    useEffect(() => {
      setProfileImagePath(getObtenerFotoPerfilGeneral());
    }, []);

    const[linkPerfilPath, setlinkPerfilPath] = useState(null);
    useEffect(() => {
      setlinkPerfilPath(getObtenerFotoPerfilGeneral());
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