# Task Management API

A RESTful API for managing user-owned tasks, built as a learning project to explore API design, HTTP semantics, authentication, validation, pagination, and backend development.

The API is documented using **OpenAPI 3.0.3** and is designed around predictable responses, clear resource ownership, and reusable request and response schemas.

## Features

- **Task management:** Create, retrieve, update, and delete tasks.
- **User-scoped resources:** Users can access and manage only their own tasks.
- **Authentication:** Bearer token authentication using JWT.
- **Pagination:** Retrieve tasks in configurable pages.
- **Filtering:** Filter tasks by status.
- **Sorting:** Sort task collections using supported fields and sort directions.
- **Request validation:** Define constraints for request bodies, query parameters, and path parameters.
- **Consistent error responses:** Reusable response schemas for common client and server errors.
- **API-first development:** Define and validate the API contract before implementing the backend.

## Tech Stack

- **API specification:** OpenAPI 3.0.3
- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL
- **Authentication:** JWT bearer tokens

## API Endpoints

The local development server uses the base URL `http://localhost:8080/v1`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | List tasks with pagination, filtering, and sorting |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks/{taskId}` | Retrieve a specific task |
| `PATCH` | `/tasks/{taskId}` | Update a task's status |
| `DELETE` | `/tasks/{taskId}` | Delete a task |

All task endpoints require authentication.

## Task Model

Each task follows a consistent resource structure:

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique task identifier |
| `ownerId` | UUID | Identifier of the task owner |
| `title` | String | Task title, up to 120 characters |
| `description` | String or null | Optional task description, up to 2,000 characters |
| `status` | Enum | `open`, `in_progress`, or `completed` |
| `dueDate` | Date or null | Optional due date |
| `createdAt` | Date-time | Task creation timestamp |
| `updatedAt` | Date-time | Last update timestamp |

Task identifiers and ownership are assigned or derived server-side rather than trusted from client input.

## Example Requests

### Create a task

`POST /v1/tasks`

```json
{
  "title": "Buy groceries",
  "description": "Get milk and eggs from the market",
  "status": "open",
  "dueDate": "2026-10-20"
}
```

A successful request returns `201 Created`, the created task, and a `Location` header identifying the new resource.

### Update a task

`PATCH /v1/tasks/{taskId}`

```json
{
  "status": "completed"
}
```

Only the task's status is mutable through this endpoint.

### List tasks

`GET /v1/tasks?page=1&limit=20&status=open&sortBy=createdAt&sortOrder=desc`

The response contains a `data` array and pagination metadata, including the total number of matching tasks and whether additional pages are available.

## HTTP Status Codes

The API uses HTTP status codes to communicate request outcomes.

| Code | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `201 Created` | Resource created successfully |
| `204 No Content` | Resource deleted successfully |
| `400 Bad Request` | Malformed request or invalid parameters |
| `401 Unauthorized` | Missing or invalid authentication credentials |
| `404 Not Found` | Resource does not exist or is not accessible to the authenticated user |
| `422 Unprocessable Entity` | Request data failed validation |
| `500 Internal Server Error` | Unexpected server-side failure |

Error responses follow reusable JSON schemas defined in the API specification.

## Design Principles

- **Resource-oriented routing:** URLs represent resources, and HTTP methods describe the requested operation.
- **Explicit contracts:** Request and response structures are documented using reusable OpenAPI schemas.
- **Least privilege:** Task access is restricted to the authenticated owner.
- **Input validation:** Unsupported fields and invalid values are rejected.
- **Safe database access:** Database queries should use parameterized statements and validated sorting fields.
- **Predictable behavior:** Status codes and response structures are consistent across endpoints.

## Project Status

The initial API contract covers the core task-management endpoints, authentication requirements, request schemas, and reusable error responses.

Backend implementation, database integration, automated tests, and deployment will be developed as subsequent stages of the project.

## Getting Started

The backend setup instructions will be added once the initial implementation is in place.

The OpenAPI specification can be inspected and validated using [Swagger Editor](https://editor.swagger.io/).

## Learning Objectives

This project is intended to develop practical understanding of:

- RESTful API design and HTTP semantics
- OpenAPI specification and API-first workflows
- Authentication and resource-level authorization
- Request validation and error handling
- Pagination, filtering, and sorting
- PostgreSQL data modelling and query safety
- Testing and documenting backend services

---

*Built as a hands-on project in designing and implementing a production-minded RESTful API.*