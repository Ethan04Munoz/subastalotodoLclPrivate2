import {Route, Routes} from "react-router-dom"
import AgregarNuevoModerador from "./paginas/AgregarNuevoModerador";
import Login from "./paginas/Login";
import PaginaNoEncontrada from "./paginas/PaginaNoEncontrada";
import Registro from './paginas/Registro';
import Verificacion from "./paginas/Verificacion";
import EditarPerfil from "./paginas/EditarPerfil";
import EditarPerfilMod from "./paginas/EditarPerfilMod";
import ReportarProducto from "./paginas/ReportarProducto";
import PublicarNuevoProducto from "./paginas/PublicarNuevoProducto";
import MenuDeInicio from "./paginas/MenuDeInicio";
import ModificarContraseña from "./paginas/ModificarContraseña";
import MenuDeInicioMods from "./paginas/MenuDeInicioMods";
import PerfilDelVendedor from "./paginas/PerfilVendedor";
import ProductosReportados from "./paginas/ProductosReportados";
import ProductoSeleccionado from "./paginas/ProductoSeleccionado";
import Busqueda from "./paginas/Busqueda";
import ImagenesManipuladas from "./paginas/ImagenesManipuladas";
import Chat from "./paginas/Chat";
import NuevosChatsReportados from "./paginas/NuevosChatsReportados";
import MensajesReportados from "./paginas/MensajesReportados";
import SuccesfulPayment from "./paginas/SucessfulPayment";
import CancelPayment from "./paginas/CancelPayment";
import Reviews from "./paginas/Reviews";
import MalasReviews from "./paginas/MalasReviews";
import CodigosFinalizacion from "./paginas/CodigosFinalizacion";
import VentasNoConcretadas from "./paginas/VentasNoConcretadas";
import EnviarPagos from "./paginas/EnviarPagos";
import PagosRecibidos from "./paginas/PagosRecibidos";

function App () {
  return( 
    <Routes>
      {/* Genericos */}
      <Route path="/login" element={<Login/>} />
      <Route path="/registro" element={<Registro/>} />
      <Route path="/*" element={<PaginaNoEncontrada/>} />
      <Route path="/verificacion" element={<Verificacion/>}/>
      {/* Usuario comun */}
      <Route path="/editarperfil" element={<EditarPerfil/>}/>
      <Route path="/publicarproducto" element={<PublicarNuevoProducto/>}/>
      <Route path="/publicarproducto/:id" element={<PublicarNuevoProducto/>}/>
      <Route path="/" element={<MenuDeInicio/>}/>
      <Route path="/usuario/:username" element={<PerfilDelVendedor/>}/>
      <Route path="/reportarproducto/:id" element={<ReportarProducto/>}/>
      <Route path="/producto/:id" element={<ProductoSeleccionado/>}/>
      <Route path="/busqueda/:busqueda/:categoria/:fPrecio/:fOfertantes/:fTiempo/:fComprarAhora" element={<Busqueda/>}/>
      <Route path="/chat/:id" element={<Chat/>}/>
      <Route path="/chat/" element={<Chat/>}/>
      <Route path="/finalizarunaventa" element={<CodigosFinalizacion/>}/>
      <Route path="/mispagos" element={<PagosRecibidos/>}/>
      <Route path="/successfulpayment" element={<SuccesfulPayment/>}/>
      <Route path="/cancelpayment" element={<CancelPayment/>}/>
      <Route path='/reviews' element={<Reviews/>}/>
      {/* Moderador */}
      <Route path="/agregarmoderador" element={<AgregarNuevoModerador/>}/>
      <Route path="/init" element={<MenuDeInicioMods/>}/>
      <Route path="/editarperfilmod" element={<EditarPerfilMod/>}/>
      <Route path="/productosreportados" element={<ProductosReportados/>}/>
      <Route path="/posiblesimagenesmanipuladas" element={<ImagenesManipuladas/>}/>
      <Route path="/nuevosChatsReportados" element={<NuevosChatsReportados/>}/>
      <Route path="/mensajesReportados" element={<MensajesReportados/>}/>
      <Route path="/malasreviews" element={<MalasReviews/>}/>
      <Route path="/ventasNoConcretadas" element={<VentasNoConcretadas/>}/>
      <Route path="/enviarpagos" element={<EnviarPagos/>}/>
    </Routes>
  )
}

export default App;