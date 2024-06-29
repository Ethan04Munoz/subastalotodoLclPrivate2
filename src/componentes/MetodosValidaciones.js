const badWords = ["pinche", "puto", "puta", "pendejo", "pendeja", "pendejada", "mierda", "baboso", "bellaco", "bobalicon", "cretino", "chupacables", "malparido", "malparida", "mentecato", "mamon", "mamona", "mamada", "verga", "vrga", "pito", "pene"]; // Lista de palabras consideradas groserías
function libreDeGroserias(textoARevisar){
  const words = textoARevisar.toLowerCase().split(" "); // Convertir el texto a minúsculas y separar en palabras
  // Iterar sobre todas las palabras y verificar si alguna de ellas está en la lista de groserías
  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i])) {
      return false; // Si se encuentra una grosería, se retorna falso
    }
  }
  
  return true; // Si no se encuentra ninguna grosería, se retorna verdadero
}
/*// Ejemplo de uso
console.log(libreDeGroserias("Este es un pinche texto normal")); // false
console.log(libreDeGroserias("Este es un texto normal")); // true*/


export function validarCorreoElectronico(correo) {
  var expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Validar el correo electrónico con la expresión regular
  if(expresionRegular.test(correo)){ //si correo cumple con el formato
      return 1;
  }else{
      return 0;
  }
}