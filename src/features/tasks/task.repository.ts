import { pool } from "../../config/database.js";

export async function getTasks() {
	const result = await pool.query(`
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
		ORDER BY created_at DESC
	`);

	return result.rows;
}