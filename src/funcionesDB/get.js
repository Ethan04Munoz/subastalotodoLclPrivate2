import { generarNumeroAleatorio } from "../componentes/Metodos";

export function getObtenerFotoPerfilGeneral(){
    //Obtener foto
    let valorNumerico = generarNumeroAleatorio(1, 5);
    let rutaFoto = `img/fotosPerfiles/user (${valorNumerico}).jpg`;
    return rutaFoto;
}

export function getValidacionesTipoUsuario(){
    //Esta funcion es para mockear el obtener un tipo de usuario (1 = normal, 2 moderador, 3 moderador sin verificar)
    //Ahora retornará directamente la string para más fácil
    //Normal
    //Mod
    //ModSinVerificar
    //NoEncontrada
    return "Normal";
}

export function getLinkPerfil(){
    return `/usuario/myusuario`;
}

export function getTopTenVendedores(){
    const usuarios = [];
    for (let id = 1; id <= 10; id++) {
        usuarios.push({
            id: id,
            username: `usuario ${id}`,
            rutaFotoPerfil: getObtenerFotoPerfilGeneral() /*"libro.png"*/
        });
    }
    return usuarios;
}