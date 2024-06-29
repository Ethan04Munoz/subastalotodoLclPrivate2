var symbols = [',', '(', ')', '$', '#', '@', '!', '&', '%', '*', '+', '-', '/', ':', ';', '<', '=', '>', '?', '^', '_', '{', '}', '[', ']', '|', '~', '.'];

export function isLetter(character) {
        return /^[a-zA-Z]$/.test(character);
        /*
            Por lo tanto, la función isLetter verifica si el carácter dado coincide con la expresión regular /^[a-zA-Z]$/. 
            Si hay una coincidencia, la función devuelve true, lo que significa que el carácter es una letra. 
            En caso contrario, devuelve false.
        */
    }


export function isUppercase(character) {
        //Primero verifica que se trate de una letra
        if(isLetter(character)){
            // Utiliza la función `toUpperCase` para convertir el carácter a mayúsculas
            // Comparamos el caracter que convertimos a mayusculas con el original.
            // Si es igual, la función devuleve true. Si no es igual, la función devuelve false.
            return character === character.toUpperCase();
        }
        else{
            return false;
        }
    }

export function isMinuscase(character) 
{
        //Primero verifica que se trate de una letra
        if(isLetter(character)){
            // Utiliza la función `toLowerCase` para convertir el carácter a mayúsculas
            // Comparamos el caracter que convertimos a mayusculas con el original.
            // Si es igual, la función devuleve true. Si no es igual, la función devuelve false.
            return character === character.toLowerCase();
        }
        else{
            return false;
        }
    }

    export function isNumber(character) {
        return !isNaN(character);
    }
    
    export function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    export function getRandomLetter(){
        //Generamos un numero random para ver si generamos mayuscula o minuscula
        let decidirMinusMayus = Math.floor(Math.random() * 2) + 1;
        if(decidirMinusMayus==1){ //minusculas
            return String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }else{
            return String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }
    export function getRandomNumber(){
        return Math.floor(Math.random() * 10);
    }
      
    export function getRandomCharacters() {
        const charCodes = [...Array(128)].map((_, i) => i);
        const randomCode = charCodes[Math.floor(Math.random() * charCodes.length)];
        return String.fromCharCode(randomCode);
    }
      
    export function contadorSimbolosEnUnaCadena(password){
        let contadorSimbolos = 0;
        for(let i = 0; i < password.length; i++){
            for(let j = 0; j<symbols.length; j++){
                if((password[i]==symbols[j])){
                   contadorSimbolos++;
                }
            }
        }
        return contadorSimbolos;
    }
export function contieneMayusculas(password){
    for (let i = 0; i < password.length; i++) {
        let character = password[i];
        // Verifica si el carácter es una letra mayúscula y establece la bandera en consecuencia
        if (isUppercase(character)) {
            return true;
        }
    }
}

export function contieneMinusculas(password){
    for (let i = 0; i < password.length; i++) {
        let character = password[i];
        // Verifica si el carácter es una letra minúscula y establece la bandera en consecuencia
        if (isMinuscase(character)) {
            return true;
        }
    }
}

export function contieneNumeros(password){
    for (let i = 0; i < password.length; i++) {
        let character = password[i];
        // Verifica si el carácter es un número y establece la bandera en consecuencia
        if (isNumber(character)) {
            return true;
        }
    }
}

export function sugerenciasArray(password){
    var recommendations = []; //Creamos un arreglo vacio que almacena las recomendaciones que iremos guardando
    // Generar recomendaciones
    let contadorSimbolos = contadorSimbolosEnUnaCadena(password);
    if(contadorSimbolos==0)
        recommendations.push("añadir un símbolo. Ejemplo: '" + getRandomSymbol() + "'"); //Se usa el .push para añadir la recomendacion a un arreglo
    if (password.length == 10) 
        recommendations.push("añadir un carácter extra. Ejemplos: '" + getRandomCharacters() + "', '" + getRandomCharacters() + "', '" + getRandomCharacters() + "'.");
    if (/[0-9]{3}/.test(password))
        recommendations.push("no usar patrones predecibles. Puedes añadir un símbolo en medio de los números consecutivos. Ejemplo: " + getRandomSymbol());
    if(recommendations.length != 0){
        return recommendations;
    }else{
        return recommendations;
    }
}

export function getOperatingSystem() {
    const userAgent = window.navigator.userAgent;
    let os = "Desconocido";
  
    if (userAgent.indexOf("Win") !== -1) {
      os = "Windows";
    } else if (userAgent.indexOf("Mac") !== -1) {
      os = "MacOS";
    } else if (userAgent.indexOf("X11") !== -1) {
      os = "UNIX";
    } else if (userAgent.indexOf("Linux") !== -1) {
      os = "Linux";
    } else if (userAgent.indexOf("Android") !== -1) {
      os = "Android";
    } else if (userAgent.indexOf("like Mac") !== -1) {
      os = "iOS";
    }
    console.log(userAgent);
    return os;
  }


  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
  ];
  
  export function formatearFechaLetras(fechaSinFormato){
    const fechaSinFormatoDate = new Date(fechaSinFormato);
    const dia = fechaSinFormatoDate.getDate();
    const mes = meses[fechaSinFormatoDate.getMonth()];
    const año = fechaSinFormatoDate.getFullYear();
    let fechaFormateada = dia + " de " + mes + " de " + año;
    console.log(fechaFormateada);
    return fechaFormateada;
  }

  export function formatearFecha(dateString) {
    //console.log("Fecha sin formatear: ", dateString);
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Enero es 0!
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    //console.log("Horas minutos segundos: ", hours, minutes, seconds);
    return `${day}:${month}:${year}   ${hours}:${minutes}:${seconds}`;
  }

  export const obtenerLinkPerfil = async () => {
    try {
        const response = await axios.get("/obtenerLinkPerfil");
        console.log("Link al perfil: ", response);
        return response.data;
    } catch (error) {
        console.log(error);
    }
  }

import {  mediaEstrella, 
    unaEstrella, 
    unaYMediaEstrella, 
    dosEstrellas, 
    dosYMediaEstrellas, 
    tresEstrellas, 
    tresYMediaEstrellas, 
    cuatroEstrellas, 
    cuatroYMediaEstrellas,
    cincoEstrellas,
    direccionServer
} from './variablesGenerales';

export const getEstrellasImage = (coeficienteVendedor) => {
  if(typeof coeficienteVendedor == "string"){
    coeficienteVendedor = parseFloat(coeficienteVendedor)
  }
    // Función para obtener la ruta de la imagen de estrellas según el coeficiente del vendedor
    switch (coeficienteVendedor) {
      case 0.5:
        return mediaEstrella;
      case 1:
        return unaEstrella;
      case 1.5:
        return unaYMediaEstrella;
      case 2:
        return dosEstrellas;
      case 2.5:
        return dosYMediaEstrellas;
      case 3:
        return tresEstrellas;
      case 3.5:
        return tresYMediaEstrellas;
      case 4:
        return cuatroEstrellas;
      case 4.5:
        return cuatroYMediaEstrellas;
      case 5:
        return cincoEstrellas;
      default:
        return cincoEstrellas; // Valor predeterminado, puedes cambiarlo según tu necesidad.
    }
};
    
export function obtenerAnchoDePantalla() {
  var screenWidth = window.innerWidth;
  console.log("Ancho de la pantalla: " + screenWidth + " píxeles");
  return screenWidth;
}

export const toNullIfZero = value => value === 0 ? 'null' : value;

export function esperarUnSegundo() {
  setTimeout(function() {
    console.log("Un segundo ha pasado");
  }, 1000);
}

const nombresAmigos = [
  'ethan', 
  'cristian', 
  'pablo', 
  'pablito', 
  'jorge', 
  'hector', 
  'dani', 
  'pepe', 
  'jose', 
  'nancy', 
  'diana', 
  'cris', 
  'karen',
  'kclg',
  'citlalli',
  'julieta'
]
export function generarNombreUsuario(){
  let nombreDeUsuario = nombresAmigos[Math.floor(Math.random() * nombresAmigos.length)];
  nombreDeUsuario = nombreDeUsuario + getRandomNumber() + getRandomNumber();
  console.log("Nombre de usuario: ", nombreDeUsuario);
  return nombreDeUsuario;
}

export function generarNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}