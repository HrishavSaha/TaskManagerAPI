import { pool } from "../../config/database.js";

import type { CreateTaskInput } from "./task-create.validation.js";

export type TaskStatus = "open" | "in_progress" | "completed";
export type TaskSortField = "status" | "dueDate" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface GetTasksOptions {
	ownerId: string;
	page: number;
	limit: number;
	status?: TaskStatus;
	sortBy: TaskSortField;
	order: SortOrder;
}

export async function getTasks(options: GetTasksOptions) {
	const { ownerId, page, limit, status, sortBy, order } = options;

	const sortColumns: Record<TaskSortField, string> = {
		status: "status",
		dueDate: "due_date",
		createdAt: "created_at",
	};

	const values: unknown[] = [ownerId];
	const conditions = ["owner_id = $1"];

	if (status) {
		values.push(status);
		conditions.push(`status = $${values.length}`);
	}

	const whereClause = conditions.join(" AND ");

	const offset = (page - 1) * limit;

	values.push(limit);
	const limitPlaceholder = `$${values.length}`;

	values.push(offset);
	const offsetPlaceholder = `$${values.length}`;

	const readSql = `
		SELECT
			id,
			owner_id,
			title,
			description,
			status,
			due_date,
			created_at,
			updated_at
		FROM tasks
		WHERE ${whereClause}
		ORDER BY ${sortColumns[sortBy]} ${order.toUpperCase()} NULLS LAST, id ASC
		LIMIT ${limitPlaceholder}
		OFFSET ${offsetPlaceholder}
	`

	const countSql = `
		SELECT COUNT(*) AS total
		FROM tasks
		WHERE ${whereClause}
	`

	const readResult = await pool.query(readSql, values);
	const countResult = await pool.query(countSql, values.slice(0, conditions.length));

	return {
		tasks: readResult.rows,
		totalItems: Number(countResult.rows[0].total),
	}
}

export async function createTask(ownerId: string, input: CreateTaskInput) {
	const insertSql = `
		INSERT INTO tasks (owner_id, title, description, status, due_date)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING
			id,
			owner_id as "ownerId",
			title,
			description,
			status,
			due_date as "dueDate",
			created_at as "createdAt",
			updated_at as "updatedAt"
	`
	const values = [ownerId, input.title, input.description ?? null, input.status, input.dueDate ?? null];

	const insertResult = await pool.query(insertSql, values);

	return insertResult.rows[0];
}

export async function getTaskById(taskId: string, ownerId: string) {
	const readSql = `
		SELECT
			id,
			owner_id as "ownerId",
			title,
			description,
			status,
			due_date,
			created_at as "createdAt",
			updated_at as "updatedAt"
		FROM tasks
		WHERE id = $1 AND owner_id = $2
		LIMIT 1
	`

	const values = [taskId, ownerId];

	const readResult = await pool.query(readSql, values);

	return readResult.rows[0] ?? null;
}