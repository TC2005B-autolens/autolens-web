import React from 'react';
import './hw1.css';

function Homework1(){
    return(
        <div className="container">
            <h3>Nueva Tarea</h3>
            <div className="textfields">
                <input type="text" name="" className='text-input' placeholder='Ingrese el nombre de la tarea'/>
                <input type="text" name="" className='text-input' placeholder='Ingrese la descripción de la tarea'/>
            </div>

        </div>
        
    );
}

export default Homework1;