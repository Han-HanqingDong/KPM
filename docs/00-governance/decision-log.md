# Decision Log

| Date | Decision | Why | Status |
| --- | --- | --- | --- |
| 2026-05-15 | Use `/Users/henry/Documents/KPM` as the single project workspace root | Keep all project materials in one well-managed location | Accepted |
| 2026-05-15 | Use a phased delivery process: requirements → technical solution → development → acceptance | Reduce rework and preserve decision quality | Accepted |
| 2026-05-15 | Prefer a Java-first technical solution in Phase 2 | Matches the owner's background and likely maintainability preferences | Accepted |
| 2026-05-15 | Define V1 as a pilot-ready release rather than a pure administration foundation | The first release should already support real project visibility and trial use | Accepted |
| 2026-05-15 | Support project-bound roles | The same person may hold different responsibilities in different projects | Accepted |
| 2026-05-15 | Support users belonging to multiple departments | Reflect Kozen's real organization structure and avoid a restrictive data model | Accepted |
| 2026-05-15 | Let authorized users manually advance or roll back project stages in V1 | A pilot release needs a maintainable source of truth for the current stage | Superseded |
| 2026-05-15 | Make project basic information and current stage visible to authorized company users by default | This directly addresses the core transparency problem while deferring sensitive-data rules | Superseded |
| 2026-05-15 | Model project stages as parallel statuses rather than one linear current stage | Real project phases may run concurrently, so each stage needs its own maintainable status | Accepted |
| 2026-05-15 | Reserve a customer-list entry in the project detail page | Future work will track customers and customer-specific states without blocking core V1 delivery | Accepted |
| 2026-05-15 | Support Chinese and English from V1 | Kozen serves global markets and the UI should be internationalization-ready from the start | Accepted |
| 2026-05-15 | Rename “Organization and Permissions” to “Resource Management” in the product navigation | The module now covers not only organization data but also reusable master data such as customers | Accepted |
| 2026-05-15 | Add customer master-data management to the product prototype | Kozen needs customers to be recorded and maintained as reusable business resources | Accepted |
| 2026-05-15 | Allow permissions such as customer maintenance to be granted to roles, departments, or specific users | The requested authorization model is broader than role-only RBAC | Superseded |
| 2026-05-15 | Complete the full product prototype before entering Phase 2 | The owner wants the product scope fully validated before technical design begins | Accepted |
| 2026-05-15 | Separate customer master data from project-specific customer status | The same customer may relate to multiple products with different progress states | Accepted |
| 2026-05-15 | Promote the project customer list from a reserved entry to an active prototype flow | The product prototype should be complete before Phase 2 begins | Accepted |
| 2026-05-15 | Configure project-customer statuses as permission-controlled enum values instead of templates | Customer states need flexibility without the overhead of workflow templates | Accepted |
| 2026-05-15 | Add a dedicated stage-detail surface with a file repository and time-ordered message stream | Each stage needs to become a trustworthy collaboration space, not just a status label | Accepted |
| 2026-05-15 | Use stage-detail access as the permission boundary for stage materials | Anyone allowed into the stage can use the stage files without extra per-file ACL complexity | Accepted |
| 2026-05-15 | Use explicit publishing for cross-stage reuse instead of file-level visibility rules | Shared materials should intentionally flow into later stages or a project material area | Accepted |
| 2026-05-15 | Make left-navigation menus permission-controlled | Menus should only appear after configuration grants visibility | Accepted |
| 2026-05-15 | Add KPM-native task management inspired by Jira | Tasks need to originate both from the task page and from stage details while staying connected to KPM context | Accepted |
| 2026-05-15 | Keep task management lightweight and focused on daily project-member tasks | The module should support KPM collaboration without trying to replace Jira | Accepted |
| 2026-05-15 | Separate project salesability from lifecycle-stage progress | A product may have stage activity but still needs a clear business answer about whether it can be sold | Superseded |
| 2026-05-15 | Add customer requirement lists and a project-level requirement overview | Customer-specific needs should be recorded individually while common needs are abstracted at product level | Accepted |
| 2026-05-15 | Support requirement creation plus invalidation/deletion actions | Requirement records need a usable lifecycle, not only read-only visibility | Accepted |
| 2026-05-15 | Prefer requirement invalidation as the normal business action, with deletion reserved for mistaken records | Product history is usually more valuable than silent removal | Accepted |
| 2026-05-15 | Do not build a standalone delay workflow for now; reflect schedule slippage through tasks | This keeps the model simpler until a real need for separate delay governance is confirmed | Accepted |
| 2026-05-15 | Implement blocker help from stage detail as a task routed to the stage owner with the project manager added as participant | This reuses the task model while making sure both execution and project oversight are involved | Accepted |
| 2026-05-15 | Let requirement creation optionally create a linked task by default | Most customer requirements need execution follow-through, but some should remain record-only until clarified | Accepted |
| 2026-05-15 | Route linked requirement tasks to the requirement creator | The creator is the first accountable owner for clarifying and driving the new requirement | Accepted |
| 2026-05-15 | Synchronize linked requirement status from task outcome | Completing or rejecting the task should immediately reflect whether the requirement was realized or rejected | Accepted |
| 2026-05-15 | Add task detail as the bridge between tasks and linked business objects | The task list alone is insufficient once tasks carry requirement and blocker context | Accepted |
| 2026-05-16 | Add task categories: requirement, bug, technical support, and other | Tasks need consistent business classification for creation, filtering, and later reporting | Accepted |
| 2026-05-16 | Complete resource-management CRUD in the prototype across users, departments, roles, permissions, customers, and customer-status options | The pilot version needs real maintainability of master data, not placeholder lists | Accepted |
| 2026-05-16 | Use enable / disable instead of physical deletion for users | Users may already be referenced by historical projects, tasks, and approvals | Accepted |
| 2026-05-16 | Use archive / restore instead of physical deletion for projects | Projects accumulate stages, tasks, customers, and materials that should remain historically traceable | Accepted |
| 2026-05-16 | Make project creation in the prototype persist a real project record | CRUD is not complete if the create flow only demonstrates screens without producing an actual project | Accepted |
| 2026-05-17 | Use a two-path authorization model: role grants plus user direct grants; departments no longer carry permissions | Keep organization structure separate from permission structure and make authorization sources easier to reason about | Accepted |
| 2026-05-17 | Derive department member counts from user-department relationships instead of manual entry | Prevent stale counts and keep the department module consistent with user data | Accepted |
| 2026-05-17 | Make project managers and project members reference real users, with project members receiving project-specific roles | Keep project collaboration data connected to the resource model instead of relying on fragile free-text labels | Accepted |
| 2026-05-17 | Let each stage bind one or more real users and/or departments as responsible parties | Reflect parallel collaboration needs and support later notification, task-routing, and permission logic | Accepted |
| 2026-05-18 | Automatically add the project manager to the project-member list | Avoid the inconsistent state where someone owns a project but is absent from its collaboration membership | Accepted |
| 2026-05-18 | Complete workflow-template maintenance with create, edit, copy, enable/disable, and deletion for draft or disabled templates | Make the process-management surface genuinely maintainable while protecting active templates from accidental removal | Accepted |
| 2026-05-18 | Make permission management a read-only system capability catalog generated from real menus and buttons | Permissions should describe actual UI capabilities, not manually maintained abstract strings | Accepted |
| 2026-05-18 | Split permissions into menu permissions and button permissions | Keep visibility control and action control explicit and understandable | Accepted |
| 2026-05-18 | Configure task statuses globally and configure allowed status transitions | The task lifecycle now needs to be adaptable without hardcoding one fixed path | Accepted |
| 2026-05-18 | Add task-status semantics: ordinary, completed, rejected | Requirement auto-sync should keep working even when status labels become configurable | Accepted |
| 2026-05-18 | Create stage tasks in a modal on the stage-detail page instead of navigating away | Preserve user context while turning stage collaboration into a smoother workflow | Accepted |
| 2026-05-18 | Show only project-member count on project detail, with member maintenance in a modal | Keep project detail readable when projects have many members | Accepted |
| 2026-05-18 | Remove “share to later stages” and keep only “publish to project materials area” | Simplify the collaboration model and keep one clear path for reusable materials | Accepted |
| 2026-05-18 | Let customers bind multiple sales owners and multiple technical-support owners | Reflect shared account responsibility in real operations | Accepted |
| 2026-05-18 | Add order management with amount calculation and modification audit history | Orders are now a first-class business object and need traceable change control | Accepted |
| 2026-05-18 | Add first-pass dashboards for orders, resource allocation, and technical support | Management views are now part of the prototype before Phase 2 | Accepted |
| 2026-05-18 | Add an interactive login page and top-right logout flow | The prototype now covers entry and exit behavior, not only in-app screens | Accepted |
| 2026-05-18 | Use combined bar-and-line charts for order statistics | A single view should support both project comparison and trend reading | Accepted |
| 2026-05-18 | Use an embedded world map with fullscreen expansion for resource allocation | Avoid map loading failures and make global inspection easier | Accepted |
| 2026-05-18 | Replace the support-customer dropdown with search-and-select | Large customer volumes need a scalable selection pattern | Accepted |
| 2026-05-18 | Preserve source order currency but let analytics unify sales into USD or CNY | Transaction entry and management reporting need different currency views | Accepted |
| 2026-05-18 | Add customer and region as multi-select order-statistics filters | Managers need to compare sales not only by project but also by market and account | Accepted |
| 2026-05-18 | Replace project filter chips with a searchable multi-select dropdown | Project lists will grow beyond what static chip lists handle well | Accepted |
| 2026-05-19 | Prepare a trial-stable prototype pass before Phase 2 | The prototype should be simple to try, with consistent references, protected enum states, and reliable cross-page linkage | Accepted |
| 2026-05-19 | Replace full user enumeration with searchable people selection | User lists will grow, so project members, stage owners, and customer owners need search-based inputs for trial usability | Accepted |
| 2026-05-19 | Show user / role permission grants as counts in list views and maintain them through searchable permission pickers | Large permission sets make the management pages visually noisy if every permission is expanded inline | Accepted |
| 2026-05-19 | Keep department management flat in V1 | Kozen currently needs department ownership and membership, not org-chart hierarchy, so flat departments reduce complexity | Accepted |
| 2026-05-19 | Promote customer management to a standalone main menu | Customers now need their own detail workspace for contacts, materials, follow-up records, and direct orders | Accepted |
| 2026-05-19 | Keep customer-status configuration in resource management | Project-customer statuses remain reusable system enum data rather than customer workspace content | Accepted |
| 2026-05-19 | Add configurable order types to orders | Kozen needs to distinguish sample orders, pre-orders, and formal orders while keeping the enum extensible | Accepted |
| 2026-05-19 | Prefer modal-based create/edit flows for lightweight CRUD | Lists should stay readable and trial users should not lose context when adding customers, orders, tasks, requirements, or resource options | Accepted |
| 2026-05-19 | Add customer level and customer activity analytics | Sales and support need a shared view of which customers/projects are active, stalled, abandoned, or inconsistent between CRM and KPM | Accepted |
| 2026-05-22 | Edit projects in a modal and require confirmation before archive, restore, or delete | Project editing should preserve the user's current context, while high-risk lifecycle actions need explicit confirmation | Accepted |
| 2026-05-22 | Model customer-project progress with configurable business statuses | A customer can be at different commercial/support states across projects, so the relationship needs its own enum such as sample test, order sprint, EOL, or support ended | Accepted |
| 2026-05-22 | Auto-create missing customer-project links when an order is created | Orders are strong evidence of an active customer-project relationship, and KPM should not rely on users to maintain that link manually | Accepted |
| 2026-05-22 | Enter Phase 2 and propose a Java-first modular monolith technical architecture | The prototype is considered broadly acceptable, and technical design should optimize for maintainability, faster delivery, and future HA readiness | Superseded |
| 2026-05-26 | Derive project status from stage statuses instead of asking the creator to choose it | Project status should reflect actual execution progress: no started stages means not started, any active stage means in progress, all completed means completed | Accepted |
| 2026-05-26 | Hide unsellable reason when project salesability is sellable | The reason only applies to unsellable products, so showing it for sellable products creates confusing data entry | Superseded |
| 2026-05-26 | Require confirmation before publishing stage files to project materials | Publishing makes a stage file reusable at project level and should be intentional | Accepted |
| 2026-06-04 | Remove project-level status, salesability, and unsellable reason from project master data | Project progress should be represented by stage statuses; customer/product commercial state belongs to the customer-project relationship | Accepted |
| 2026-05-26 | Revise Phase 2 architecture proposal to controlled Java microservices for 1000 concurrent users | The capacity target increased and Kozen prefers distributed deployment with Nacos-like service/config governance | Proposed |
| 2026-05-26 | Use free/open-source-first infrastructure choices in the Phase 2 architecture | Kozen wants to avoid unnecessary license fees and commercial dependencies while keeping production options open | Proposed |
| 2026-05-26 | Use Eclipse Temurin OpenJDK 21 rather than Oracle JDK Java 8 for the new KPM core | Java 8 would force older Spring Boot/Spring Cloud versions and adds support/licensing risk; Java 21 fits the selected Spring Boot 4 / Spring Cloud 2025 stack | Accepted |
| 2026-05-26 | Implement built-in KPM IAM login because Kozen has no SSO | KPM must own account/password login, token issuance, password hashing, logout/revocation, and login audit while keeping future SSO compatibility | Proposed |
| 2026-05-26 | Use Alibaba Cloud OSS as the first production file-storage implementation | Kozen prefers OSS, so KPM should store files in OSS behind an internal storage abstraction | Proposed |
