import express from "express";

export const problemsRouter = express.Router();

problemsRouter.route("/:id/cases").post();
