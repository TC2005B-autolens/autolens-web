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

app.get("/member/:groupid/canva/nu", async (req, res) => {
  try {
    const { groupid } = req.params;
    const query = `
      SELECT 
        c.title AS "title",
        g.code AS "group_code",
        COUNT(gm.member_id) AS "members_count"
      FROM 
        courses c
      JOIN 
        group_members gm ON c.id = gm.group_id
      JOIN 
        groups g ON gm.group_id = g.id
      WHERE
        c.title = $1 
      GROUP BY 
        c.title, g.code;
    `;
    const { rows } = await client.query(query, [groupid]);
    const formattedData = {
      title: rows[0].title,
      groups: rows.map((row) => ({
        code: row.group_code,
        members: parseInt(row.members_count),
      })),
    };
    res.json(formattedData);
  } catch (error) {
    console.error("Error al obtener la información del curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/asdnc/:studentid", async (req, res) => {
  try {
    const { studentid } = req.params;
    const query = `
      SELECT g.code AS group_code
      FROM persons p
      JOIN group_members gm ON p.id = gm.member_id
      JOIN groups g ON gm.group_id = g.id
      WHERE p.id = $1;
    `;
    const result = await pool.query(query, [studentid]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// app.get("/member/canva/:group_id/grading", async (req, res) => {
//   try {
//     const { group_id } = req.params;
//     const query = `
//       SELECT s.student_id AS ID,
//             sub.assignment_id AS ID_Tarea,
//             MAX(COALESCE(g.passed_tests, 0)) AS Pruebas
//       FROM student s
//       JOIN submission sub ON s.student_id = sub.student_id
//       LEFT JOIN submission_analysis sa ON sub.id = sa.submission_id
//       LEFT JOIN grading g ON sa.id = g.analysis_id
//       WHERE s.canvas_group_id = $1
//       GROUP BY s.student_id, sub.assignment_id;
// `;
//     res.json(rows);
//   } catch (error) {
//     console.error("Error al obtener los IDs de los estudiantes:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// app.post(
//   "/canva/:assign_id/:course_id/:lang_id/:title/:description/:due_date/:group_id/publisher",
//   async (req, res) => {
//     try {
//       const {
//         assign_id,
//         course_id,
//         lang_id,
//         title,
//         description,
//         due_date,
//         group_id,
//       } = req.params;

//       const query1 =
//         "SELECT canvas_group_id FROM student WHERE canvas_group_id = $1 LIMIT 1";
//       const query2 =
//         "INSERT INTO assignment (id, course_id, language_id, title, descript, due_date, pub_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)";

//       try {
//         const result = await client.query(query1, [group_id]);
//         if (result.rows.length === 0) {
//           return res
//             .status(400)
//             .json({ error: "El grupo especificado no existe" });
//         }

//         await client.query(query2, [
//           assign_id,
//           course_id,
//           lang_id,
//           title,
//           description,
//           due_date,
//         ]);

//         res.status(201).json({ message: "Tarea creada exitosamente" });
//       } catch (error) {
//         console.error("Error al crear la tarea:", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//       }
//     } catch (error) {
//       console.error("Error al procesar la solicitud:", error);
//       res.status(500).json({ error: "Error interno del servidor" });
//     }
//   }
// );

// app.delete("/member/canva/:group_id/delete/:student_id", async (req, res) => {
//   try {
//     const { group_id, student_id } = req.params;
//     const query =
//       "DELETE FROM submission WHERE student_id='" +
//       student_id +
//       "' AND canvas_group_id = (SELECT canvas_id FROM teacher WHERE canvas_id = '" +
//       group_id +
//       "')";
//     // Ejecutar la consulta SQL
//     await client.query(query);
//     res.status(200).json({
//       message: `El estudiante ${student_id} ha sido eliminado del grupo ${group_id}`,
//     });
//   } catch (error) {
//     console.error("Error al eliminar el estudiante del grupo:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
