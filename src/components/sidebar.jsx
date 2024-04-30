import * as React from "react";
import './styles.css';
import {Link} from 'react-router-dom';

const handleImageClick = (event) => {
    // Aquí puedes colocar la lógica que deseas ejecutar cuando se haga clic en la imagen
    console.log('Imagen clickeada:', event.target.src);
    };

function Sidebar() {
  return (
    <>
      <div className="div">
        <div className="div-2">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ea02af91978b4a6a9aff1a8c63c62ccd71c93bef6b13cf35964dd8d2fcedde53?"
            className="img"
            
          />
          <img
            loading="lazy"
            srcSet="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
            className="icons"
          />
          <Link to="/courses">
          <img
            loading="lazy"
            src="https://img.icons8.com/windows/32/book--v1.png"
            className="icons"
            />
          </Link>
          <Link to ='/new-assignment/title'>
          <img
            loading="lazy"
            src="https://img.icons8.com/windows/32/add--v1.png"
            className="icons"
          />
          </Link>
          <Link to="/feedback">
          <img
            loading="lazy"
            id="ok"
            src="https://cdn-icons-png.freepik.com/512/1442/1442912.png?ga=GA1.1.1548435843.1713736732"
            className="icons"
          />
          </Link>
          <img
            loading="lazy"
            src="https://img.icons8.com/material-outlined/24/help.png"
            className="help"
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;