import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from '../paginas/axiosConfig.js';
import { useState } from 'react';
import ModalSesionCerrada from '../paginas/ModalSesiónCerrada.jsx';

// Asegúrate de reemplazar 'tu_clave_publicable_de_stripe' con tu clave publicable real de Stripe
const stripePromise = loadStripe('pk_test_51O8y6fDgEcaJfuuXm1SIuf2zfGcZMMZcVKiEwROxUe2KrIMvFzWq480vi5LBFd9sjdMN28Zo5aWxayt0cXnA7h7500RHfIWMaW');

const CheckoutButton = ({ productId }) => {
  const [sesionCerrada, setSesionCerrada] = useState(false);

  const handleClick = async (event) => {
    // Previene la acción por defecto del botón
    event.preventDefault();
    console.log("Handleando el clic: ", productId);
    // Obtén la instancia de Stripe
    const stripe = await stripePromise;

    try {
      // Llama a tu API para crear la sesión de checkout usando axios
      const response = await axios.post('/create-checkout-session', { productId });
      console.log("Response checkout: ", response);
      window.open(response.data.url);
    } catch (error) {
      // Maneja errores aquí si la solicitud falló
      console.error(error);
      if(error.response.status==400){
        alert(error.response.data);
      }
      if (error.response.data.error== "Usuario no autenticado"){
        setSesionCerrada(true);
      }
    }
  };

  return (
    <>
      <button role="link" onClick={handleClick} className='normalBtn'>
        Pagar
      </button>
      {sesionCerrada && (
        <ModalSesionCerrada/>
      )} 
    </>
  );
};

export default CheckoutButton;
