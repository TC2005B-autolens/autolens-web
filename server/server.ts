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

function maybeReconnect() {
  if (!client) {
    console.log('Base de datos desconectada. Intentando reconectar...');
    client = new pg.Client({
      connectionString: process.env.DB_CONNECTION_STRING || "",
    });
  }
}

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
        console.log(response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });

    console.log(lens_assignment);

    maybeReconnect();
    await client?.query(
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

app.get("/api/users/:uid/assignments", async (req, res) => {
  maybeReconnect();
  try {
    const result = await client?.query(
      `
        SELECT a.id, a.title, a.description, a.pub_date, a.due_date, a.lens_data, g.code
        FROM assignments a
        JOIN groups g ON a.group_id = g.id
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.member_id = $1
        GROUP BY g.code, a.id;
      `, [req.params.uid],
    );

    if (!result?.rows.length) {
      res.status(404).json([]);
      return;
    }
  
    res.json(result.rows.map(row => {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        pubDate: row.pub_date,
        dueDate: row.due_date,
        groupCode: row.code,
        lensData: JSON.parse(row.lens_data)
      }
    }));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "internal server error" });
  }
});

app.post("/api/assignments/:aid/submit", async (req, res) => {
  const submissionData = req.body.files.map(f => ({
    path: f.path,
    content: f.content
  }))

  maybeReconnect();
  try {
    let assignment = await client?.query(
      `SELECT lens_data FROM assignments WHERE id = $1`, [req.params.aid]
    )
    if (!assignment?.rows.length) {
      res.status(404).json({ message: "assignment not found" });
      return;
    }
    
    let assignmentData = JSON.parse(assignment.rows[0].lens_data);
    
    const lensResponse = await fetch(`${lens_api_url}/assignments/${assignmentData.id}/submissions`, {
      method: "POST",
      body: JSON.stringify({
        files: submissionData
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (lensResponse.status === 400) {
      res.status(400).json({ message: "Invalid data", error: await lensResponse.json() });
      return;
    } else if (lensResponse.status >= 400) {
      throw new Error(`HTTP error! status: ${lensResponse.status}`);
    }
    res.status(200).json(await lensResponse.json());
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "internal server error" });
  }
});

const port = 8867;
const server = ViteExpress.listen(app, port, () => {
  console.log(`Running express at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
});
