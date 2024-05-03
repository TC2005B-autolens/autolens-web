// @ts-check

import pg from "pg";
import express from "express";
import ViteExpress from "vite-express";
import "dotenv/config";

import { NewAssignmentFormSchema } from "../app/lib/assignment"
import { z } from "zod";

const app = express();

const lens_api_url = process.env.LENS_API_URL && `${process.env.LENS_API_URL}/api/v1`;
if (!lens_api_url) {
  console.error("LENS_API_URL not set");
  process.exit(1);
}

let client: (pg.Client | null) = new pg.Client({
  connectionString: process.env.DB_CONNECTION_STRING || "",
});

client.connect((error) => {
  if (error) throw error;
  console.log("Conectado a la base de datos");
});

client.on('error', async (error) => {
  console.error('Error en la conexión a la base de datos:', error);
  client = null;
});

app.get("/", (req, res) => {
  res.redirect("/app");
});

app.use("/api", express.json());

app.post("/api/groups/:gid/assignments", async (req, res) => {
  try {
    let body = NewAssignmentFormSchema.parse(req.body);
    let gid = req.params.gid;

    let lens_assignment = await fetch(`${lens_api_url}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: body.files.map((f, i) => i === 0 ? { ...f, main: true } : f),
        language: body.language,
        tests: body.tests
      })
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });

    if (!client) {
      console.log('Base de datos desconectada. Intentando reconectar...');
      client = new pg.Client({
        connectionString: process.env.DB_CONNECTION_STRING || "",
      });
    }
    await client.query(
      `
        INSERT INTO assignments (title, description, pub_date, due_date, group_id, lens_data) VALUES
        ($1, $2, NOW(), $3, $4, $5)
      `,
      [
        body.title,
        body.description,
        body.dueDate,
        gid,
        lens_assignment
      ]
    );

    res.json({ message: "ok" });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "invalid data" });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
});

const port = 8867;
const server = ViteExpress.listen(app, port, () => {
  console.log(`Running express at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
});
