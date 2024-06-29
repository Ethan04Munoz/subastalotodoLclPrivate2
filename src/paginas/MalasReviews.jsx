import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig.js';
import Label from '../componentes/componentes/LblCentrado.jsx';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import './MalasReviews.css';
import { Rating } from 'react-simple-star-rating';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function MalasReviews(){
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
            .then(response => {
                console.log("Validacion: ", response)
                if(response.data.tipoUsuario == 2){
                    setRenderizar('Mod')
                }else if(response.data.tipoUsuario == 3){
                    history('/editarperfilmod')
                }else{
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

    const [malasReviews, setMalasReviews] = useState([]);
    useEffect(() => {
        axios.get("/obtenerMalasReview")
        .then(response => {
            console.log("malas reviews: ", response.data);
            setMalasReviews(response.data);
        })
        .catch(error => {
            console.log("Eror obteniendo malas reviews: ", error);
        })
    }, []);

    if(renderizar=="Mod"){
        return (
            <div className='MalasReviews'>
                <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
                <SubHeader />
                <Label tipoLbl='lblTituloColor' textoLbl="Malas reviews"/>
                {malasReviews.length > 0 ? (
                    <table className="tablaMalasReviews">
                        <thead>
                            <tr className="gridearTablaMalasReviews">
                                <th className="">Vendedor</th>
                                <th className="">Comprador</th>
                                <th className="">Review</th>
                            </tr>
                        </thead>
                    <tbody>
                        {malasReviews.map((review) => (
                            <tr key={review.idReseña} className="gridearTablaMalasReviews">
                                <td className='perfilMalasReviews'>
                                    <a className='perfilMalasReviews' href={`/usuario/${review.nombreVendedor}`}>
                                        <div className="dividir50ElGrideoMalasReviews">
                                            <img src={review.fotoPerfilVendedor} className='imgTablaMalasReviews'/> 
                                            <p>
                                                {review.nombreVendedor}
                                            </p>
                                        </div>
                                    </a>
                                </td>
                                <td className="perfilMalasReviews">
                                    <a className='perfilMalasReviews' href={`/usuario/${review.nombreComprador}`}>
                                        <div className="dividir50ElGrideoMalasReviews">
                                            <img src={review.fotoPerfilComprador} className='imgTablaMalasReviews'/> 
                                            <p>
                                                {review.nombreComprador}
                                            </p>
                                        </div>
                                    </a>
                                </td>
                                <td className="">
                                    <p>
                                        Nombre del producto: {review.nombreProducto}
                                    </p>
                                    <p> 
                                        Rating: {/* Aquí usar estrellas */}
                                        <Rating
                                            initialValue={review.calificacion}
                                            readonly={true}
                                            size={100}
                                            allowFraction={true}
                                        />
                                    </p>
                                    <p>
                                        Review: {review.comentario}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                    <div className="formRegistro">
                        <Label tipoLbl="lblTitulo" textoLbl="Ey! Parece que ya terminaste por aquí." />
                    </div>
                )}
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
}

export default MalasReviews;