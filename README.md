# KPM — Kozen Project Management

KPM is the product workspace for planning, designing, building, and launching Kozen Project Management.

## Working phases

1. **Requirement preparation**
   - Clarify the business problem, users, workflows, and scope
   - Produce a PRD and product prototype
2. **Technical solution**
   - Design the architecture, data model, APIs, deployment model, and technology choices
   - Prefer a Java-first stack unless product constraints suggest otherwise
3. **Development**
   - Implement the approved solution
   - Design for at least 1000 concurrent users, high availability, and high concurrency
4. **Acceptance and launch**
   - Prepare deployment steps and one-command deployment where practical
   - Test, fix, and iterate until the release is acceptable

## Workspace map

| Path | Purpose |
| --- | --- |
| `docs/00-governance/` | Project charter, roadmap, decision log |
| `docs/01-requirements/` | Requirement intake, PRD, glossary |
| `docs/03-architecture/` | Technical solution and architecture decisions |
| `docs/04-development/` | Backlog, implementation notes, test strategy |
| `docs/05-delivery/` | Deployment, acceptance, release notes |
| `apps/backend/` | Backend source code |
| `apps/frontend/` | Frontend source code |
| `infra/` | Infrastructure and environment configuration |
| `scripts/` | Automation scripts |

## Current status

- **Current phase:** Phase 3 — Development and integration hardening
- **Next milestone:** Keep the formal React + Java microservice implementation clean, testable, and ready for trial use.



## Continuing in a future session

To resume KPM in a new conversation, start with:

- `START-HERE.md`
- `docs/00-governance/project-state.md`
- `docs/00-governance/session-handoff.md`
- `项目介绍.md`

Recommended prompt for a new session:

> Continue KPM from `/Users/henry/Documents/KPM`. Read `START-HERE.md` first, then continue from the current project state.

The project files are the durable source of truth; do not rely on conversational memory alone.
