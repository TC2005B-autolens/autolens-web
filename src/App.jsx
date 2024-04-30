import React from 'react';
import { useState } from 'react'
import Sidebar from './components/sidebar';
import Course from './components/course'
import './App.css';
import Tablist from './tablist/tablist';
import Homework1 from './hw1/hw1';
import TextField from './components/textfield';
import Options from './components/options'
import Text from './components/text'
import NextButton from './components/nextbutton';
import Files from './components/files'
import Activity from './components/activity'
import User from './components/user'
import {Button, EditIcon, Pane, Dialog, FileUploader, FileCard, FileRejectionReason} from 'evergreen-ui'
import { Disclosure } from '@headlessui/react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { commentsToCode } from './comments';
import { generatePdfFromComments } from './report';

export default function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={ <MainScreen /> } />
          <Route path="/courses" element={ <CoursesScreen /> } />
          <Route path="/course" element={ <CourseScreen courseName='Curso 1002'/> } />
          <Route path="/checked-assignments" element={ <CheckedHWScreen/> } />
          <Route path="/assignment" element={ <Assignment/> } />
          <Route path="/new-assignment/title" element={ <NuevaTareaScreen2/> } />
          <Route path="/new-assignment/files" element={ <NuevaTareaScreen3/> } />
          <Route path="/new-assignment/tests" element={ <NuevaTareaScreen4/> } />
          <Route path="/new-assignment/prev" element={ <NuevaTareaScreen5/> } />
          <Route path="/feedback" element={ <FeedbackScreen/> } />
        </Routes>
  </div>
);
}

function MainScreen(){
  return(
      <div>
      <CourseScreen courseName='Curso 1'/>
      </div>
  );
}

function DefaultDialogExample() {
  const [isShown, setIsShown] = React.useState(false)
  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Dialog title"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Custom Label"
      >
        Dialog content
      </Dialog>

      <Button onClick={() => setIsShown(true)}>Show Dialog</Button>
    </Pane>
  )
}

function CoursesScreen(){
  const [isShown, setIsShown] = React.useState(false);

  const handleShowDialog = () => {
    setIsShown(true);
  };

  return(
  <div style={{display:'flex',position:'relative',}}>
    <Sidebar className="sidebar"/>
  <div>
  <h3>Cursos</h3>
    <Button marginY={8} marginRight={12} marginLeft={1100} iconBefore={EditIcon} onClick={handleShowDialog}>
      Nuevo curso
    </Button>
    <div className='checkedActCont'>
      <Activity activityName='TC1002' group='30 integrantes' route='course'/>
      <Activity activityName='TC1003' group='25 integrantes'/>
      <Activity activityName='TC1004' group='32 integrantes'/>
      <Activity activityName='MA1028' group='20 integrantes'/>
    </div>
  </div>
  {isShown && (
  <Pane>
      <Dialog
        isShown={isShown}
        title="Dialog title"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Custom Label"
      >
        Dialog content
      </Dialog>
    </Pane>
  )}
  </div>
);
}

function CourseScreen(props){
return(
  <div className='recentassignments'>
   <Sidebar className="sidebar"/>
   <div className="tareaContainerL">
    <h3>{props.courseName}</h3>
      <h2>Tareas recientes</h2>
    <div className='courseCont'>
      <div className="checkedActCont">
        <Activity activityName='Actividad 1' group='TC1002S' route='assignment'/>
        <Activity activityName='Actividad 2' group='MA1028'/>
        <Activity activityName='Quiz 2' group='Q1008B'/>
        <Activity activityName='Reflexión 3' group='MA1029'/>
      </div>
      <div className="usersContainer">
      <h2>Alumnos</h2>
      <User/>
      <User/>
      <User/>
      <User/>
      </div>
      </div>
    </div>
  </div>
  );
}

function CheckedHWScreen(props){
  return(
    <div style={{display:'flex',position:'relative',}}>
    <Sidebar className="sidebar"/>
  <div>
  <h3>Tareas revisadas</h3>
    <div className="checkedActCont">
      <Activity activityName='Activity 1' group ='Grupo 2004' route='assignment'/>
      <Activity activityName='Activity 1' group ='Grupo 3022'/>
      <Activity activityName='Activity 1' group ='Grupo 4202'/>
    </div>
  </div>
  </div>
  );
}

function NuevaTareaScreen2(){
  return(
    <div className="maincontainer">
    <Sidebar/>
    <div className='tareaContainer'>
      <div className="textfields">
        <div>
          <h3>Crear tarea</h3>
        </div>
        <Tablist/>
          <h2>Nueva tarea</h2>
          <TextField type = "title" placeholder = 'Ingrese el titulo de la tarea'/>
          <TextField type = "desc" placeholder = 'Ingrese la descripción de la tarea'/>
        </div>
    </div>
    </div>
  );
}

function NuevaTareaScreen3(){
  return(
    <div className="maincontainer">
      <Sidebar/>
      <div className="tareaContainerL">
      <h3>Crear tarea</h3>
      <Tablist/>
      <h2>Archivos</h2>
      <div className="filesContainer">
      <Files/>
      </div>
      <h2>Templates</h2>
        <div className="filesContainer">
          <Files/>
        </div>
      </div>
    </div>
  );
}

function NuevaTareaScreen4(){
  return(
    <div className='maincontainer'>
    <Sidebar/>
    <div className="content">
      <div className="nuevatarea">
      <h3>Crear tarea</h3>
        <Tablist/>
      </div>
  <div className="main">
    <div className="title">
      <h2>Pruebas</h2>
      <Button marginY={8} marginRight={12} marginLeft={1100} iconBefore={EditIcon}>
        Nueva prueba
      </Button>
       </div>
        <MyDisclosure pruebaName ='Prueba 1' pruebaDesc='Obtener de salida un "Hello World"'/>
        <MyDisclosure pruebaName ='Prueba 2' pruebaDesc='Obtener de salida un "Hello World"'/>
        <MyDisclosure pruebaName ='Prueba 3' pruebaDesc='Obtener de salida un "Hello World"'/>
      </div>
    </div>
  </div>
  );
}

function NuevaTareaScreen5(){
  return (
    <div className="maincontainer">
      <Sidebar/>
    <div className="contPrev">
      <h3>Crear tarea</h3>
      <Tablist/>
      <h2>Previsualización</h2>
      <h1>Título de la tarea</h1>
      <Text className = 'textcontainer' content='Hola'/>
      <h1>Descripción de la tarea</h1>
      <Text className = 'textcontainer' content="Lorem ipsum dolor sit amet consectetur adipiscing elit placerat sem, mi ullamcorper ligula arcu at mus quis parturient justo tellus, morbi mauris etiam sociosqu augue libero nisl leo. Class molestie vitae ultricies maecenas netus natoque facilisis laoreet scelerisque taciti, sagittis nisi lectus pulvinar ornare sodales iaculis id quisque nullam, neque nec et pellentesque fringilla tempus luctus interdum tortor. Mollis sociis dapibus sed potenti aliquet lacinia imperdiet montes suscipit, accumsan ante tristique blandit vestibulum aliquam ac erat, primis eros risus nascetur urna vel est proin. Porttitor venenatis velit praesent porta orci, mattis litora dui nostra dictumst semper, dictum inceptos duis ridiculus."/>
      <h1>Archivos y templates</h1>
      <Files language='Python' fileName='main.py'/>
      <h1>Pruebas</h1>
      <MyDisclosure pruebaName='Prueba 1' pruebaDesc='Obtener de salida del programa un "Hola mundo"'/>
      <div className="button">
      <NextButton text='Publicar' route='course'/>
      </div>
      </div>
    </div>
  );
}

function Assignment(){
  return(
    <div className="maincontainer">
      <Sidebar/>
      <div className="contPrev">
      <h3>Actividad 1</h3>
      <Button onClick={() => generatePdfFromComments(2, "POO", ["Mal uso de encapsulacion", "Conceptos no fueron aplicados correctamente", "Errores en la definicion de clases"], ["Raul", "Leonardo"], ["Rafa", "Antonio"])}>Generar reporte </Button>
      <h2>Descripción de la tarea</h2>
      <Text content='En esta tarea tienes que arreglar los bugs del código y hacer una nueva función que pida al usuario su nombre y matricula.'/>
      <h2>Archivos y templates</h2>
      <Files language='Python' fileName='ejercicio1.py'/>
      <h2>Pruebas</h2>
      <MyDisclosure pruebaName='Prueba 1' pruebaDesc='Hacer la función area, que calcule el area de un triangulo'/>
      <MyDisclosure pruebaName='Prueba 1' pruebaDesc='Hacer la función area, que calcule el area de un triangulo'/>
      <div className="button">
      <NextButton text='Regresar a actividades' route='course'/>
      </div>
      </div>
    </div>
  );
}

function FeedbackScreen() {
  const [fileContent, setFileContent] = React.useState(null);

  const handleFeedbackRequest = () => {
    if (fileContent) {
      // Realiza una solicitud a tu función que proporciona retroalimentación automática
      commentsToCode(fileContent, 'python');
    } else {
      alert("Por favor, sube un archivo primero.");
    }
  };

  const handleFileContent = (content) => {
    setFileContent(content);
  };

  return (
    <div className="maincontainer">
      <Sidebar />
      <div className="contPrev">
        <h3>Retroalimentación automática</h3>
        <h2>Sube un archivo para que nuestra inteligencia artificial de una retroalimentación a tu código. </h2>
        <FileUploaderSingleUploadDemo onFileContent={handleFileContent} />
        <Button style={{backgroundColor: '#d9d9d9',
        width: '30vh',
        height: '5vh', 
        borderRadius:'8px',
        border:'1px solid #000',
        padding: '5px',
        display:'flex',
        justifyContent:"center",
        alignItems:'center',
        font: '700 15px League Spartan, -apple-system, Roboto, Helvetica,sans-serif'}}onClick={handleFeedbackRequest}>Enviar</Button>
      </div>
    </div>
  );
}

function FileUploaderSingleUploadDemo({ onFileContent }) {
  const [file, setFile] = React.useState(null);

  const handleChange = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      onFileContent(content);
    };
    reader.readAsText(files[0]);
    setFile(files[0]);
  };

  return (
    <Pane maxWidth={654}>
      <FileUploader
        label="Subir archivo"
        description="Puedes subir un archivo desde hasta 50 MB."
        maxSizeInBytes={50 * 1024 ** 2}
        maxFiles={1}
        onChange={handleChange}
        values={file ? [file] : []}
      />
    </Pane>
  );
}

function MyDisclosure(props) {
    return (
      <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="custom-button-class">{props.pruebaName}
          <img src="https://img.icons8.com/ios/100/expand-arrow--v1.png" alt="" />
          </Disclosure.Button>
          <Disclosure.Panel className="custom-panel-class">
            {props.pruebaDesc}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    );
}

