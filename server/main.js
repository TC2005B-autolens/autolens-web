import express from 'express';
import ViteExpress from "vite-express";
import 'dotenv/config';

const app = express();
console.log(process.env.SECRET);

app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.listen(app, 8867, () => console.log("Server is listening..."));
