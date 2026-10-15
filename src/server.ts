import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { pool } from "./config/database.js";

import { getTasks } from "./features/tasks/task.repository.js";

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
	res.status(200).json({
		"status": "ok"
	})
});

app.get('/health/db', async (_req, res) => {
	try {
		await pool.query("SELECT 1");

		res.status(200).json({
			status: "ok",
			database: "connected",
		});
	} catch (error) {
		console.error("Database health check failed:", error);

		res.status(503).json({
			status: "error",
			database: "unavailable",
		});
	}
});

app.get('/v1/tasks', async (_req, res) => {
	try {
		const tasks = await getTasks();

		res.status(200).json({
			data: tasks
		});
	} catch (error) {
		console.error("Failed to fetch tasks:", error);

		res.status(500).json({
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occured.",
			},
		});
	}
});

app.listen(process.env.PORT ?? 8080);