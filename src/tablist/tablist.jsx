import React from 'react';
import './tablist.css'
import { Button, Pane, Text, majorScale, Tablist, Tab, Paragraph } from 'evergreen-ui'
import {Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function BasicTabsExample() {
  const location = useLocation();
    const tabs = [
      { titulo: 'Título, descripción y lenguaje', ruta: '/new-assignment/title' },
      { titulo: 'Archivos y templates', ruta: '/new-assignment/files' },
      { titulo: 'Pruebas estandarizadas', ruta: '/new-assignment/tests' },
      { titulo: 'Publicación', ruta: '/new-assignment/prev' }
    ];
    
    const selectedIndex = tabs.findIndex(tab => tab.ruta === location.pathname);

    return (
      <Pane height={30}>
        <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
          {tabs.map((tab, index) => (
            <Tab
              aria-controls={`panel-${tab.titulo}`}
              isSelected={index === selectedIndex}
              color={index === selectedIndex ? 'black' : 'white'} // Cambia el color del texto aquí
              backgroundColor={index === selectedIndex ? 'black' : 'black'}
              key={tab.titulo}
              id={tab.titulo}
              onSelect={() => {
                if (index <= selectedIndex + 1) {
                  setSelectedIndex(index);
                }
              }}
              disabled={index > selectedIndex + 1}
            >
              <Link className='linkStyle' to={tab.ruta}>{tab.titulo}</Link>
            </Tab>
          ))}
        </Tablist>
        <Pane padding={16} flex="1">
          {tabs.map((tab, index) => (
            <Pane
              key={tab.titulo}
              id={`panel-${tab.titulo}`}  
              aria-labelledby={tab.titulo}
              aria-hidden={index !== selectedIndex}
              display={index === selectedIndex ? 'block' : 'none'}
              role="tabpanel"
            >
            </Pane>
          ))}
        </Pane>
      </Pane>
    )
  }

function Tablists() {
  return (
    <div id='container'>
        <div className="tabs">
            <BasicTabsExample/>
        </div>
    </div>
  );
}

export default Tablists;
