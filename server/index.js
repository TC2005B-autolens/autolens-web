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
//muestra total de los miembroes de un grupo
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
//Muestra los grupos en los que se encuentra un estudiante
app.get("/asdnc/:studentid", async (req, res) => {
  try {
    const { studentid } = req.params;
    const query = `
      SELECT g.code AS group_code
      FROM group_members gm
      JOIN groups g ON gm.group_id = g.id
      WHERE gm.member_id = $1
      GROUP BY g.code;

    `;
    const result = await pool.query(query, [studentid]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
//Muestra todos los grupos que existen en la DB
app.get("/groups/all", async (req, res) => {
  try {
    const query = `
      SELECT code AS group_code
      FROM groups;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
//Muestra todos los grupos que tiene un curso y los ensena en una lista
app.get("/course/groups", async (req, res) => {
  try {
    const query = `
      SELECT courses.id AS course_id, courses.title AS course_title, groups.code AS group_code
      FROM groups
      INNER JOIN courses ON groups.course_id = courses.id;
    `;
    const result = await client.query(query);
    let courses = new Map();

    // Iterar sobre los resultados y agrupar los grupos por curso
    result.rows.forEach((row) => {
      const { course_id, course_title, group_code } = row;

      // Verificar si ya existe el curso en el mapa
      if (!courses.has(course_id)) {
        // Si no existe, crear una nueva entrada para el curso
        courses.set(course_id, {
          course_id,
          course_title,
          groups: [group_code], // Inicializar la lista de grupos con el primer grupo
        });
      } else {
        const course = courses.get(course_id);
        course.groups.push(group_code);
      }
    });
    const coursesArray = Array.from(courses.values());
    res.json(coursesArray);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
