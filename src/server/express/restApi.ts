import packageJSON from "../../../package.json";
import express, { Application } from "express";
import cors from "cors";
import { Request, Response } from "express";
import octokit from "@/lib/octokit.ts";
import asyncHandler from "express-async-handler";

const app: Application = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve a successful response. For use with wait-on
app.get("/api/v1/health", (req, res) => {
  res.send({ status: "ok" });
});

app.get(`/api/v1/version`, (req: Request, res: Response) => {
  const respObj: RespExampleType = {
    id: 1,
    version: packageJSON.version,
    envVal: process.env.ENV_VALUE as string, // sample server-side env value
  };
  res.send(respObj);
});

app.get("/api/v1/repos", asyncHandler(async (req, res) => {
  try {
    const { data } = await octokit.repos.listForUser({
      username: "pareklund",
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repositories" });
  }  res.send({ status: "ok" });
}));

app.use(express.static("./.local/vite/dist"));

export default app;
