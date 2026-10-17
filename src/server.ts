import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { pool } from "./config/database.js";

import { getTasks } from "./features/tasks/task.repository.js";
import { validateGetTasksQuery } from "./features/tasks/task.validation.js";

import { createTask } from "./features/tasks/task.repository.js";
import { validateCreateTaskBody } from "./features/tasks/task-create.validation.js";

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

app.get('/v1/tasks', async (req, res) => {
	const validation = validateGetTasksQuery(req);

	if (!validation.success) {
		res.status(400).json({
			error: {
				code: "BAD_REQUEST",
				message: validation.message,
			}
		});
		return;
	}

	const ownerId = "11111111-1111-4111-8111-111111111111";

	try {
		const { tasks, totalItems } = await getTasks({ ...validation.data, ownerId });

		res.status(200).json({
			data: tasks,
			pagination: {
				page: validation.data.page,
				limit: validation.data.limit,
				total: totalItems,
				totalPages: Math.ceil(totalItems / validation.data.limit),
			}
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

app.post('/v1/tasks', async (req, res) => {
	const validation = validateCreateTaskBody(req);

	if (!validation.success) {
		res.status(422).json({
			error: {
				code: "UNPROCESSABLE_ENITY",
				message: validation.message,
			},
		});
		return;
	}

	const ownerId = "11111111-1111-4111-8111-111111111111";
	
	try {
		const task = await createTask(ownerId, validation.data);

		res.status(201).json({
			data: task,
		});
	} catch (error) {
		console.log("Failed to create task:", error);

		res.status(500).json({
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "An unexpected error occurred.",
			},
		});
	}
})

app.listen(process.env.PORT ?? 8080);
