# Spec 0011 — Linear Integration Bug Fixes

## Status

Draft

## Context

During a real-world session on 21 March 2026, HQ (the Reasoning Agent) was used extensively to create and manage Linear issues and projects for the HQ backlog. Multiple integration failures were discovered through dogfooding. These failures are silent — the API calls appear to succeed but the writes do not persist.

This spec documents all failures observed and describes the fixes required.

## Observed Failures

### 1. Assignee updates silently fail

**Reproduction:** Call `update_linear_issue` with a valid `assigneeId`. The call returns success but the assignee is not updated on the issue.

**Impact:** Cannot assign issues to team members from HQ.

### 2. Comments do not persist

**Reproduction:** Call `add_linear_comment` with a valid `issueId` and markdown body. The call returns success but no comment appears on the issue.

**Impact:** Cannot annotate issues with context, decisions, or status updates.

### 3. Cannot read issue comments

**Observation:** No tool exists to retrieve comments from a Linear issue. `search_linear_issues` returns core fields only (title, description, state, priority, labels).

**Impact:** HQ cannot read context added by team members or verify its own comments landed.

### 4. Project assignment is inconsistent

**Reproduction:** Call `create_linear_issue` with a valid `projectId`. Sometimes the issue appears in the project, sometimes it does not. Calling `update_linear_issue` with `projectId` after creation also silently fails.

**Impact:** Issues created by HQ may not appear in the correct project. Manual intervention required.

### 5. Cannot discover user IDs

**Observation:** No tool exists to list workspace members or look up user IDs. HQ cannot programmatically determine who to assign issues to.

**Impact:** Even if assignee updates worked, HQ has no way to find valid user IDs.

### 6. No error propagation

**Observation:** All of the above failures return success to HQ. No error messages, no partial failure indicators. HQ believes operations succeeded when they did not.

**Impact:** HQ confidently reports success to the user when nothing happened. Worst possible UX.

## Current State — Files to Read

The Builder Agent MUST read and understand these files before making changes:

- `mcp-server/src/linear-tools.ts` — Current Linear tool implementations
- `mcp-server/src/index.ts` — MCP server entry point and tool registration
- `mcp-server/package.json` — Dependencies including `@linear/sdk`
- `package.json` — Root package.json for workspace dependencies

## Task

### Phase 1: Fix silent failures — Error propagation

Every Linear API call must:

1. Await the response from the Linear SDK
2. Check the response `success` field
3. If `success` is false, return the error details to HQ
4. If an exception is thrown, catch it and return a meaningful error message
5. Never return a success indicator unless the operation verifiably succeeded

### Phase 2: Fix assignee updates

1. Investigate why `update_linear_issue` with `assigneeId` silently fails
2. Verify the Linear SDK `issueUpdate` mutation correctly accepts `assigneeId`
3. Add response validation — confirm the returned issue has the expected assignee
4. Add integration test: update an issue assignee and verify it persists

### Phase 3: Fix comment creation

1. Investigate why `add_linear_comment` does not persist comments
2. Verify the Linear SDK `commentCreate` mutation is called correctly
3. Ensure the `issueId` parameter is resolved (handle both UUID and identifier formats like KRA-5)
4. Add response validation — confirm the comment was created
5. Add integration test: create a comment and verify it exists

### Phase 4: Fix project assignment

1. Investigate why `projectId` is inconsistently applied during issue creation
2. Verify the Linear SDK `issueCreate` mutation correctly accepts `projectId`
3. Test both at-creation and post-creation project assignment
4. Add response validation for both paths

### Phase 5: Add new tools

#### `list_linear_users`

- List all members of the Linear workspace
- Return: user ID, name, email, display name
- Purpose: Allow HQ to discover valid assignee IDs

#### `get_linear_issue_comments`

- Retrieve all comments on a given issue
- Accept issue ID or identifier (e.g. KRA-5)
- Return: comment body, author, created date
- Purpose: Allow HQ to read context and verify its own comments

### Phase 6: Validation

After all changes, verify the following operations work end-to-end:

1. Create an issue with a project assignment — verify it appears in the project
2. Update an issue assignee — verify the assignee persists
3. Add a comment to an issue — verify the comment is readable
4. List workspace users — verify user IDs are returned
5. Read comments on an issue — verify comment content is returned
6. Trigger an intentional error — verify error details are returned to HQ

## Agent Roles

### Builder Agent

- Read all files listed in Current State
- Implement fixes in phases 1-5
- Run `pnpm install`, `pnpm lint`, `pnpm build` after changes
- Fix any lint or build errors
- Write provenance record

### Testing Agent

- Verify all six validation scenarios pass
- Verify error propagation works for invalid inputs
- Verify no regressions in existing working tools (create issue, search issues, list teams, etc.)

## Constraints and Assumptions

- The Linear SDK (`@linear/sdk`) is already installed and available
- Authentication is via Personal Access Token (PAT) for now — KRA-5 tracks migration to App registration
- All fixes must be backward compatible — existing working tools must not break
- The MCP server architecture must be preserved — tools are registered via the existing pattern

## Provenance Record

The Builder Agent must write a provenance record to:

`.sdd/provenance/prov-0011-linear-bug-fixes.md`

Documenting:

- Which files were modified and why
- Root cause of each silent failure
- Any design decisions made during implementation
- Test results for each validation scenario
