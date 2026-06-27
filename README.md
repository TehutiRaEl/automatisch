# Automatisch — Workflow Automation Colony

[![Colony](https://img.shields.io/badge/colony-colony-orange)](#)
[![Archetype](https://img.shields.io/badge/archetype-workflow-darkorange)](#)
[![Layer](https://img.shields.io/badge/layer-7%20CHILD-yellow)](#)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue)](LICENSE)
[![Hive](https://img.shields.io/badge/hive-sovereign--hive-gold)](#)

> Open-source Zapier alternative and hive automation bus — 1000+ app integrations, self-hosted, GDPR-compliant.

## Role in the Sovereign Hive

| Field | Value |
|-------|-------|
| colony_id | `automatisch` |
| role | colony |
| archetype | workflow |
| layer | 7 (CHILD — Workflow Expression) |
| entity | CHILD (Workflow Expression) |
| guilds | workflow, automation, integration |
| queen | THEHIVE :8080 |
| port | 3001 |

## What This Does

Automatisch is the workflow automation colony — the hive's integration bus. It connects 1000+ services (Slack, GitHub, Google Sheets, Stripe, webhooks, and more) via a no-code drag-and-drop builder. Within the Sovereign Hive it serves as:

- **Automation Bus**: Routes inter-colony workflow triggers between THEHIVE, aether, NAR2, and external services
- **Webhook Hub**: Receives external webhooks and fans them as hive events
- **LLM Chain Runner**: Executes LLM-backed automation flows using the Queen's `/v11/llm/chat` endpoint
- **Scheduled Tasks**: Cron-driven colony health checks and constitution compliance scans

Data stays on your server. No vendor lock-in. GDPR-compliant by design.

## Quick Start

```bash
git clone https://github.com/TehutiRaEl/automatisch
cd automatisch
docker-compose up -d
```

Open `http://localhost:3001` to access the workflow builder.

Or for development:
```bash
npm install
npm run build
npm run start:dev
```

## Colony Standard Layer

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/colony/health` | Live health + uptime |
| GET | `/colony/info` | Colony identity, layer, entity, guilds |
| GET | `/colony/manifest` | Endpoints + capabilities |
| POST | `/colony/events` | Accept hive dispatch events |
| GET | `/colony/agents` | Workflow engine agent |

## Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthcheck` | Application health |
| GET | `/api/flows` | List automation flows |
| POST | `/api/flows` | Create new flow |
| GET | `/api/connections` | List app connections |
| POST | `/webhooks/{id}` | Webhook trigger entry |

## Architecture

```
automatisch (workflow / layer 7) :3001
├── packages/
│   ├── backend/                    # Express.js API + BullMQ
│   │   └── src/
│   │       ├── server.js           # App entry point
│   │       ├── routes/
│   │       │   ├── colony.js       # Colony standard layer (ES module)
│   │       │   └── index.js        # Route aggregator
│   │       ├── jobs/               # BullMQ job processors
│   │       └── models/             # Objection.js models
│   └── web/                        # React frontend
│       └── src/
│           └── components/
│               └── FlowBuilder/    # Drag-and-drop flow editor
├── colony.json                     # Colony identity manifest
├── soul.md                         # F-001–F-006 constitution (synced from Queen)
├── docker-compose.yml
└── .github/workflows/
    └── constitution-receive.yml    # Auto-sync soul.md from Queen
```

## Services (Docker)

| Service | Port | Description |
|---------|------|-------------|
| automatisch | 3001 | Main app (API + frontend) |
| postgres | 5432 | Flow/connection storage |
| redis | 6379 | BullMQ job queue |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_SECRET_KEY` | *(required)* | Session signing secret |
| `POSTGRES_HOST` | `postgres` | PostgreSQL hostname |
| `POSTGRES_DATABASE` | `automatisch` | Database name |
| `REDIS_HOST` | `redis` | Redis hostname |
| `QUEEN_URL` | `http://localhost:8080` | THEHIVE Queen URL |
| `ENCRYPTION_KEY` | *(required)* | Credentials encryption key |

## Hive Integration

Automatisch accepts hive events at `POST /colony/events` and can trigger flows from Queen dispatches. Use the webhook trigger to receive any `repository_dispatch` or `HiveMesh` event and route it to downstream apps.

Example: Constitution-sync trigger → Slack notification → JIRA ticket.

## Constitution Sync

Receives `soul.md` updates from the Queen via `.github/workflows/constitution-receive.yml`.

## Contributing

This is a fork of [automatisch/automatisch](https://github.com/automatisch/automatisch) with Sovereign Hive colony integration. Upstream improvements are welcome. Hive-specific changes go in `packages/backend/src/routes/colony.js`.
