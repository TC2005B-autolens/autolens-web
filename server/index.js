const { Client } = require("pg");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const client = new Client({
  connectionString:
    "postgresql://autolensDB_owner:e4Fv0YIATVWb@ep-dry-wave-a5d77r71.us-east-2.aws.neon.tech/autolensDB?sslmode=require",
});

client.connect((error) => {
  if (error) throw error;
  console.log("Conectada a la base de datos");
});

// Endpoint para obtener los IDs de los estudiantes asociados a un profesor en sus grupos
app.get("/member/:teacherid/canva/:groupid", async (req, res) => {
  try {
    const { groupid, teacherid } = req.params;
    const query = `
      SELECT DISTINCT s.student_id
      FROM submission s
      JOIN teacher t ON s.canvas_group_id = $1
      WHERE t.teacher_id = $2`;
    const { rows } = await client.query(query, [groupid, teacherid]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los IDs de los estudiantes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/member/canva/:group_id/grading", async (req, res) => {
  try {
    const { group_id } = req.params;
    const query = `
      SELECT s.student_id AS ID,
            sub.assignment_id AS ID_Tarea,
            MAX(COALESCE(g.passed_tests, 0)) AS Pruebas
      FROM student s
      JOIN submission sub ON s.student_id = sub.student_id
      LEFT JOIN submission_analysis sa ON sub.id = sa.submission_id
      LEFT JOIN grading g ON sa.id = g.analysis_id
      WHERE s.canvas_group_id = $1
      GROUP BY s.student_id, sub.assignment_id;
`;
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los IDs de los estudiantes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post(
  "/canva/:assign_id/:course_id/:lang_id/:title/:description/:due_date/:group_id/publisher",
  async (req, res) => {
    try {
      const {
        assign_id,
        course_id,
        lang_id,
        title,
        description,
        due_date,
        group_id,
      } = req.params;

      const query1 =
        "SELECT canvas_group_id FROM student WHERE canvas_group_id = $1 LIMIT 1";
      const query2 =
        "INSERT INTO assignment (id, course_id, language_id, title, descript, due_date, pub_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)";

      try {
        const result = await client.query(query1, [group_id]);
        if (result.rows.length === 0) {
          return res
            .status(400)
            .json({ error: "El grupo especificado no existe" });
        }

        await client.query(query2, [
          assign_id,
          course_id,
          lang_id,
          title,
          description,
          due_date,
        ]);

        res.status(201).json({ message: "Tarea creada exitosamente" });
      } catch (error) {
        console.error("Error al crear la tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// app.post()

//     const result = await client.query(query, [group_id]);
//     if (result.rows.length > 0) {
//       res.status(200).json({
//         message: `Lista de pruebas realizadas por los alumnos en el grupo ${group_id}`,
//         data: result.rows,
//       });
//     } else {
//       res.status(404).json({
//         error: `No se encontraron pruebas realizadas por los alumnos en el grupo ${group_id}`,
//       });
//     }
//   } catch (error) {
//     console.error(
//       "Error al obtener la lista de pruebas realizadas por los alumnos:",
//       error
//     );
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

app.delete("/member/canva/:group_id/delete/:student_id", async (req, res) => {
  try {
    const { group_id, student_id } = req.params;
    const query =
      "DELETE FROM submission WHERE student_id='" +
      student_id +
      "' AND canvas_group_id = (SELECT canvas_id FROM teacher WHERE canvas_id = '" +
      group_id +
      "')";
    // Ejecutar la consulta SQL
    await client.query(query);
    res.status(200).json({
      message: `El estudiante ${student_id} ha sido eliminado del grupo ${group_id}`,
    });
  } catch (error) {
    console.error("Error al eliminar el estudiante del grupo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// app.post("/canva/analyze/:student_id", async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const query = `
//       SELECT s.student_id AS ID_estudiante, sub.assignment_id, g.passed_tests AS Passed_tests, g.grad_date AS grading_date
//       FROM student s
//       JOIN submission sub ON s.student_id = sub.student_id
//       JOIN submission_analysis sa ON sub.id = sa.submission_id
//       JOIN grading g ON sub.id = g.analysis_id
//       WHERE s.student_id = $1;`;
//     const result = await client.query(query, [student_id]);
//     if (result.rows.length > 0) {
//       res.status(200).json({
//         message: `Los datos del estudiante ${student_id} han sido obtenidos exitosamente`,
//         data: result.rows,
//       });
//     } else {
//       res.status(404).json({
//         error: `No se encontraron datos para el estudiante ${student_id}`,
//       });
//     }
//   } catch (error) {
//     console.error("Error al obtener datos del estudiante:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});

// const { Client } = require("pg");
// const fs = require("fs");
// const express = require("express");
// const app = express();
// const cors = require("cors");

// app.use(cors());

// // app.js

// // const postgres = require("postgres");
// // require("dotenv").config();

// // let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

// // const sql = postgres({
// //   host: PGHOST,
// //   database: PGDATABASE,
// //   username: PGUSER,
// //   password: PGPASSWORD,
// //   port: 5432,
// //   ssl: "require",
// //   connection: {
// //     options: `project=${ENDPOINT_ID}`,
// //   },
// // });

// // sql.connect((error) => {
// //   if (error) throw error;
// //   console.log("Conectada");
// // });

// // async function getPgVersion() {
// //   const result = await sql`select version()`;

// //   console.log(result);
// // }

// // getPgVersion();

// const client = new Client({
//   connectionString:
//     "postgresql://autolensDB_owner:e4Fv0YIATVWb@ep-dry-wave-a5d77r71.us-east-2.aws.neon.tech/autolensDB?sslmode=require",
// });
// client.connect((error) => {
//   if (error) throw error;
//   console.log("Conectada");
// });
// // endpoints
// // Get Student ID

// //Devuelve una lista de los IDs que tiene el docente en sus grupos
// app.get("/member/:teacherid/canva/:studentid", (req, res) => {
//   connection.query(
//     "SELECT DISTINCT s.student_id FROM submission s JOIN teacher t ON '" +
//       req.params.studentid +
//       "' = '" +
//       req.params.teacherid +
//       "'",
//     (error, resultados) => {
//       if (error) throw error;
//       res.json(resultados);
//     }
//   );
// });

// //Ya funciona
// // async function intento1() {
// //   try {
// //     await client.connect(); // Asegura que la conexión al cliente esté establecida
// //     const selectQuery =
// //       "SELECT DISTINCT s.student_id FROM submission s JOIN teacher t ON s.canvas_group_id = t.canvas_id";
// //     const res = await client.query(selectQuery);
// //     console.log("Consulta exitosa:", res.rows); // Imprime el resultado de la consulta
// //   } catch (err) {
// //     console.error("Error durante la consulta:", err);
// //   } finally {
// //     await client.end(); // Cierra la conexión al cliente después de la consulta
// //   }
// // }

// //intento1();
// //Insertar datos a las tablas
// // async function insertData() {
// //   try {
// //     await client.connect(); // Ensure client connection is established
// //     const insertQuery =
// //       "INSERT INTO submission (id, student_id, canvas_group_id, assignment_id, sub_date) VALUES ('SUB1', 'S1', 'T1', 'ASSIGN1', '2024-04-24'), ('SUB2', 'S2', 'T1', 'ASSIGN1', '2024-04-25'), ('SUB3', 'S3', 'T2', 'ASSIGN2', '2024-04-26');";
// //     const res = await client.query(insertQuery);
// //     console.log("Insertion success:", res); // Output insertion result
// //   } catch (err) {
// //     console.error("Error during the insertion:", err);
// //   }
// // }
// // insertData();

// // async function createUsersTable() {
// //   await client.connect();
// //   const result = await client.query(`
// // CREATE TABLE student(
// // student_id TEXT PRIMARY KEY
// // );
// // CREATE TABLE teacher(
// // canvas_id VARCHAR(45)
// // );
// // CREATE TABLE submission(
// // id VARCHAR(45),
// // student_id VARCHAR(45),
// // canvas_group_id VARCHAR(45),
// // assignment_id VARCHAR(45),
// // sub_date DATE
// // );
// // CREATE TABLE assignment(
// // id VARCHAR(45),
// // course_id VARCHAR(45),
// // language_id VARCHAR(45),
// // title VARCHAR(25),
// // descript TEXT,
// // due_date DATE,
// // pub_date DATE
// // );
// // CREATE TABLE language(
// // id VARCHAR(45),
// // l_name TEXT,
// // docker_image_id VARCHAR(45)
// // );
// // CREATE TABLE submission_analysis(
// // id VARCHAR(45),
// // submission_id VARCHAR(45),
// // sub_analy_date DATE
// // );
// // CREATE TABLE grading(
// // id VARCHAR(45) PRIMARY KEY,
// // analysis_id VARCHAR(45),
// // passed_tests INT,
// // grad_date DATE,
// // instance_id VARCHAR(45)
// // );
// // CREATE TABLE ai_analysis(
// // id VARCHAR(45) PRIMARY KEY,
// // analysis_id VARCHAR(45),
// // modelo TEXT,
// // ai_date DATE
// // );
// // CREATE TABLE docker_instance(
// // id VARCHAR(45),
// // server_id VARCHAR(45),
// // image_id VARCHAR(45)
// // );
// // CREATE TABLE server(
// // server_id VARCHAR(45),
// // location TEXT
// // );
// // CREATE TABLE docker_image(
// // id VARCHAR(45),
// // image_URL TEXT,
// // language_id VARCHAR(45)
// // );
// //     `);
// //   console.log(result);
// // }

// // createUsersTable();
