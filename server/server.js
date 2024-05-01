// @ts-check

import pg from "pg";
import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";

import "dotenv/config";

const app = express();

const client = new pg.Client({
  connectionString: process.env.DB_CONNECTION_STRING || "",
});

client.connect((error) => {
  if (error) throw error;
  console.log("Conectada a la base de datos");
});

app.get("/", (req, res) => {
  res.redirect("/app");
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

app.post("/assignments", (req, res) => {
  const data = req.body;
});

const port = 8867;
const server = ViteExpress.listen(app, port, () => {
  console.log(`Running express at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
});
