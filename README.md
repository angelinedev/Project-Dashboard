# Smart Kanban Dashboard

A modular MERN monorepo for a high-end task and project management dashboard with a Kanban workflow, audit trail, analytics, and AI-powered task summarization.

## Workspace Structure

```text
Dashboard/
|-- Backend/
|   |-- package.json
|   |-- .env.example
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- config/
|       |   `-- db.js
|       |-- constants/
|       |   `-- task.js
|       |-- controllers/
|       |   |-- healthController.js
|       |   `-- taskController.js
|       |-- middleware/
|       |   |-- errorHandler.js
|       |   |-- notFound.js
|       |   `-- requestLogger.js
|       |-- models/
|       |   |-- AuditLog.js
|       |   `-- Task.js
|       |-- routes/
|       |   |-- healthRoutes.js
|       |   |-- index.js
|       |   `-- taskRoutes.js
|       |-- services/
|       |   `-- auditLogService.js
|       `-- utils/
|           `-- asyncHandler.js
|-- Frontend/
|   |-- package.json
|   |-- index.html
|   |-- jsconfig.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       |-- components/
|       |   |-- analytics/
|       |   |   `-- PriorityHeatmapCard.jsx
|       |   |-- audit/
|       |   |   `-- AuditTrailPreview.jsx
|       |   |-- dashboard/
|       |   |   `-- KanbanPreviewCard.jsx
|       |   `-- layout/
|       |       |-- AppShell.jsx
|       |       |-- Sidebar.jsx
|       |       `-- TopBar.jsx
|       |-- pages/
|       |   `-- DashboardPage.jsx
|       `-- utils/
|           `-- navigation.js
|-- package.json
`-- README.md
```

## Getting Started

1. Install dependencies from the repository root with `npm install`.
2. Copy `Backend/.env.example` to `Backend/.env` and update the MongoDB connection string.
3. Run both apps with `npm run dev`.

## Step 1 Scope

- Workspace-style MERN structure
- Express server boilerplate
- MongoDB connection layer
- `Task` and `AuditLog` schemas
- Vite + React + Tailwind frontend shell
