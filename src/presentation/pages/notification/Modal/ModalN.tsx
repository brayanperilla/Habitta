import "./modal.css"
import { Link } from "react-router-dom";

function ModalN() {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Notificaciones</h2>
        <div>
          <br />
          <h4>Nueva propiedad disponible</h4>
          <br />
          <p>¡Hola! Queríamos informarte que una nueva propiedad que coincide con tus preferencias ha sido agregada a nuestro catálogo. No pierdas la oportunidad de echarle un vistazo y encontrar tu próximo hogar.</p>
          <br />
          <p>Hace 29 minutos</p>
        </div>
        <br />
         <div>
          <br />
          <h4>Nuevo Mensaje </h4>
          <br />
          <p>¡Hola! Queríamos informarte que una nueva propiedad que coincide con tus preferencias ha sido agregada a nuestro catálogo. No pierdas la oportunidad de echarle un vistazo y encontrar tu próximo hogar.</p>
          <br />
          <p>Hace 29 minutos</p>
        </div>
        <br />
         <div>
          <br />
          <h4>Nueva promocion</h4>
          <br />
          <p>¡Hola! Queríamos informarte que una nueva propiedad que coincide con tus preferencias ha sido agregada a nuestro catálogo. No pierdas la oportunidad de echarle un vistazo y encontrar tu próximo hogar.</p>
          <br />
          <p>Hace 29 minutos</p>
        </div>
     
        
        <Link to="/Notification"><button className="close-button">Cerrar</button></Link>
      </div>
    </div>
  )  
}
export default ModalN