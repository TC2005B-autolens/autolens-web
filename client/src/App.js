import logo from "./logo.svg";
import axios from "axios";

import "./App.css";
const courseTitle = encodeURIComponent("Programación Orientada a Objetos");
// Función para obtener los IDs de los estudiantes
const getStudentID = () => {
  axios
    .get(`http://localhost:3000/member/${courseTitle}/canva/nu`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    });
};
const getStudentGroups = () => {
  axios
    .get(`http://localhost:3000/asdnc/1`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    });
};

// const getGrades = () => {
//   axios
//     .get("http://localhost:3000/member/canva/Group1/grading")
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("Hubo un problema con la solicitud:", error);
//     });
// };

// const postAssignment = () => {
//   axios
//     .post(
//       "http://localhost:3000/canva/A003/C003/L003/Intento/lolololol/2024-05-30/Group1/publisher"
//     )
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("Hubo un problema con la solicitud:", error);
//     });
// };

// const postGrade = () => {
//   axios
//     .post("http://localhost:3000/canva/analyze/S1")
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("Hubo un problema con la solicitud:", error);
//     });
// };

// const deleteStudent = () => {
//   axios
//     .delete("http://localhost:3000/member/canva/Group2/delete/S2")
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("Hubo un problema con la solicitud:", error);
//     });
// };

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={getStudentID}>Get Student ID</button>
        <button onClick={getStudentGroups}>Get Groups</button>
        {/* <button onClick={getGrades}>Get Grades</button>
        <button onClick={postAssignment}>Publish Assignments</button> */}
        {/* <button onClick={postGrade}>Post Grade</button> */}
        {/* <button onClick={deleteStudent}>Delete</button> */}
      </header>
    </div>
  );
}

export default App;

// import logo from "./logo.svg";
// import axios from "axios";

// import "./App.css";
// const getStudentID = () => {
//   fetch(
//     "postgresql://autolensDB_owner:e4Fv0YIATVWb@ep-dry-wave-a5d77r71.us-east-2.aws.neon.tech/autolensDB/member/T2/canva/T2"
//   )
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => {
//       console.error("There was a problem with the fetch operation:", error);
//     });
// };

// // const getStudentID = () => {
// //   axios.get("http://localhost:3000/member/T2/canva/T2").then((data) => {
// //     console.log(data);
// //   });
// // };

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//         <button onClick={getStudentID}>Get Student ID</button>
//       </header>
//     </div>
//   );
// }

// export default App;
