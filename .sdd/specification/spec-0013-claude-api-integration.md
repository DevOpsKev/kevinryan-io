---
title: "Spec 0013: Claude API Integration for Automated SDD Implementation"
draft: false
---

## Agent Roles

This specification is the single source of truth for what to build, how to verify it, and who does what. Each agent reads its role below and follows the instructions exactly. Agents do not communicate directly — they communicate through the provenance document.

### Builder Agent

**Purpose:** Read this specification and produce working software with full provenance.

**Reads:**

- This specification
- Any prerequisites listed below
- Updated provenance (on subsequent cycles, to address failing scenarios)

**Produces:**

- Working software that satisfies all requirements in this spec
- A provenance record at `.sdd/provenance/spec-0013-claude-api-integration.provenance.md`

**Instructions:**

1. Save this spec to `.sdd/specification/spec-0013-claude-api-integration.md` in the repo. This is the canonical reference. Do not modify it after saving.
2. Read the full specification, all prerequisites, and all files listed under "Current state" before writing any code.
3. Build the software as specified. Where the specification is silent on an implementation detail, make a reasonable decision and record it in the provenance.
4. Write provenance as you build, not after. Every assumption, interpretation, and deviation is recorded as it happens. Use the provenance template at `.sdd/provenance/template.md`.
5. For every assumption not explicitly stated in this spec, record it under "Assumptions" in the provenance.
6. For every ambiguity in this spec, record it under "Ambiguities" with your interpretation and the decision you made.
7. Do not write tests. Testing is not your role.
8. When the build is complete, add a "Build Status" entry to the provenance summarising what was built.
9. Commit the spec, implementation, and provenance together.

**On subsequent cycles (fixing failing scenarios):**

1. Read the updated provenance, specifically the "Testing Agent Findings" and "Scenario Results" sections.
2. For each failing scenario, read the linked prose scenario in `.sdd/scenarios/spec-0013-claude-api-integration.scenarios.md` to understand what was tested and why.
3. Fix the implementation to satisfy the failing scenario.
4. Update the provenance: add entries to "Actions Taken" and, if your fix involved a new decision or assumption, record it.
5. Do not modify the testing agent's sections of the provenance. Append to your own sections only.

### Testing Agent

**Purpose:** Read this specification and the builder's provenance, then generate prose scenarios and executable tests that verify the software against the spec.

**Reads:**

- This specification
- The provenance document at `.sdd/provenance/spec-0013-claude-api-integration.provenance.md`

**Produces:**

- Prose scenarios at `.sdd/scenarios/spec-0013-claude-api-integration.scenarios.md` (use the scenario template at `.sdd/scenarios/template.md`)
- Executable test code in the `tests/` directory, derived from the prose scenarios
- Updates to the provenance document recording findings

**Instructions:**

1. Read this specification in full.
2. Read the provenance document at `.sdd/provenance/spec-0013-claude-api-integration.provenance.md` in full.
3. Compare the provenance against the specification. Identify:
   - **Gaps:** Requirements in the spec that the provenance does not address.
   - **Assumptions:** Decisions the builder made where the spec was silent. These are primary targets for scenarios.
   - **Ambiguities:** Places where the builder interpreted an ambiguous requirement. Generate scenarios that test whether the interpretation was reasonable.
   - **Silences:** Things the provenance does not mention at all. These may indicate missing implementation or missing provenance.
   - **Deviations:** Anywhere the builder deviated from the spec. Generate scenarios that test the impact.
4. Write prose scenarios to `.sdd/scenarios/spec-0013-claude-api-integration.scenarios.md`. Each scenario must:
   - Reference the specific spec requirement or provenance entry that triggered it.
   - State what is being tested and why, in plain language.
   - Define pass/fail criteria before any code is written.
5. Implement each prose scenario as executable test code in `tests/`. Every test must trace back to a numbered scenario in the prose document.
6. Run the tests against the built software.
7. Update the provenance document. Append a "Testing Agent Findings" section (do not modify the builder's sections). Record:
   - Gaps, assumptions, ambiguities, and silences found.
   - Scenario results (pass/fail with references to scenario IDs).
   - Recommendations: whether failing tests indicate a code fix, a spec clarification, or a provenance gap.

**On subsequent cycles:**

1. Re-read the updated provenance (including the builder's new entries).
2. Reassess existing scenarios — are they still relevant? Do the builder's fixes resolve them?
3. Generate new scenarios if the builder's fixes introduced new assumptions or decisions.
4. Re-run all tests. Update the provenance with new results.

---

## Task

1. Save this spec to `.sdd/specification/spec-0013-claude-api-integration.md` in the repo.
2. Implement all changes described below.
3. After completing all work, create a provenance record at `.sdd/provenance/spec-0013-claude-api-integration.provenance.md`. See the provenance template at `.sdd/provenance/template.md`.

## Prerequisites

- Spec 0011 deployed: HQ GitHub MCP integration must be functional
- Spec 0008 deployed: HQ web interface must be available
- Read ADR-018 (`docs/adr/adr-018-secret-management.md`) — Secret management patterns for API keys

## Context

The current SDD workflow requires manual intervention between spec writing and implementation. We want to enable a fully automated cycle where:

1. A human writes a spec using the SDD template
2. Claude (via API) acts as the Builder Agent, reading the spec and implementing it
3. Claude (via API) acts as the Testing Agent, generating scenarios and tests
4. The cycle continues until all tests pass

This creates a true "spec-to-code" pipeline with full provenance tracking.

### Current state (read these files before making changes)

| File / Directory | What it does |
|-----------------|-------------|
| `.sdd/specification/template.md` | SDD spec template with agent roles |
| `.sdd/provenance/template.md` | Provenance tracking template |
| `apps/hq/` | HQ web interface (Next.js + Auth0) |
| `apps/hq/lib/github-mcp.ts` | GitHub MCP integration |
| `k8s/hq-kevinryan-io/` | HQ Kubernetes manifests |

### Key facts

- **Claude API Endpoint:** `https://api.anthropic.com/v1/messages`
- **HQ Base URL:** `https://hq.kevinryan.io`
- **GitHub Repository:** `DevOpsKev/kevin-ryan-platform`
- **Secret Management:** Azure Key Vault via External Secrets Operator
- **MCP Server:** GitHub integration already available
- **Authentication:** Auth0 for HQ interface

## 1. Claude API Client Library

Create a reusable Claude API client that can be used both from the HQ interface and as a standalone CLI tool.

```typescript
// apps/hq/lib/claude-api.ts
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeApiConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface SddAgentContext {
  role: 'builder' | 'tester';
  specPath: string;
  repositoryName: string;
  githubToken: string;
}

export class ClaudeApiClient {
  constructor(private config: ClaudeApiConfig) {}

  async sendMessage(messages: ClaudeMessage[]): Promise<string> {
    // Implement Anthropic API client
  }

  async actAsBuilderAgent(context: SddAgentContext): Promise<{
    success: boolean;
    provenance: string;
    commitSha?: string;
    error?: string;
  }> {
    // Implement builder agent workflow
  }

  async actAsTestingAgent(context: SddAgentContext): Promise<{
    success: boolean;
    scenarios: string;
    testResults: Array<{ id: string; passed: boolean; details: string }>;
    provenanceUpdate: string;
    error?: string;
  }> {
    // Implement testing agent workflow
  }
}
```

**Design notes:**

- Use the official Anthropic SDK for reliable API communication
- Separate concerns: API client vs. SDD agent logic
- Include proper error handling and rate limiting
- Support both streaming and non-streaming responses
- Make it testable with dependency injection

## 2. SDD Automation CLI Tool

Create a CLI tool that can execute the full SDD cycle from the command line.

```typescript
// tools/sdd-cli/src/index.ts
import { Command } from 'commander';
import { ClaudeApiClient, SddAgentContext } from '../../apps/hq/lib/claude-api';

interface SddCliConfig {
  claudeApiKey: string;
  githubToken: string;
  repository: string;
}

class SddCli {
  constructor(private config: SddCliConfig) {}

  async executeSpec(specPath: string): Promise<void> {
    // 1. Validate spec exists and follows template
    // 2. Create Claude client
    // 3. Execute builder agent
    // 4. Execute testing agent
    // 5. Iterate until tests pass or max cycles reached
    // 6. Report results
  }

  async validateSpec(specPath: string): Promise<boolean> {
    // Check spec follows template structure
    // Validate all prerequisites are met
    // Ensure spec is not in draft mode
  }

  async runBuilderCycle(specPath: string): Promise<void> {
    // Act as builder agent using Claude API
  }

  async runTestingCycle(specPath: string): Promise<void> {
    // Act as testing agent using Claude API
  }
}

const program = new Command();

program
  .name('sdd')
  .description('Spec-Driven Development automation via Claude API')
  .version('1.0.0');

program
  .command('execute')
  .description('Execute a complete SDD cycle for a specification')
  .argument('<spec-path>', 'Path to the specification file')
  .option('--max-cycles <number>', 'Maximum number of build/test cycles', '3')
  .option('--dry-run', 'Validate spec without executing')
  .action(async (specPath, options) => {
    // Implementation
  });

program
  .command('validate')
  .description('Validate a specification without executing it')
  .argument('<spec-path>', 'Path to the specification file')
  .action(async (specPath) => {
    // Implementation
  });

program.parse();
```

**Design notes:**

- Use commander.js for robust CLI argument parsing
- Support dry-run mode for validation without execution
- Include progress reporting and logging
- Allow configuration via environment variables or config file
- Exit with appropriate codes for CI/CD integration

## 3. HQ Web Interface Integration

Add SDD automation controls to the HQ web interface.

```typescript
// apps/hq/components/SddAutomation.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SddExecutionStatus {
  specPath: string;
  status: 'idle' | 'running' | 'success' | 'error';
  currentCycle: number;
  maxCycles: number;
  logs: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }>;
}

export default function SddAutomation() {
  const [executions, setExecutions] = useState<SddExecutionStatus[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('');

  const startExecution = async (specPath: string) => {
    // Start SDD execution via API call to Claude
  };

  const stopExecution = async (specPath: string) => {
    // Cancel running execution
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SDD Automation</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Spec selection, execution controls, progress display */}
      </CardContent>
    </Card>
  );
}
```

## 4. API Endpoints for SDD Execution

Create Next.js API routes to handle SDD automation requests.

```typescript
// apps/hq/app/api/sdd/execute/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { ClaudeApiClient } from '@/lib/claude-api';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { specPath, maxCycles = 3 } = await request.json();

    // Validate inputs
    if (!specPath || typeof specPath !== 'string') {
      return NextResponse.json({ error: 'Invalid spec path' }, { status: 400 });
    }

    // Get API keys from environment
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;

    if (!claudeApiKey || !githubToken) {
      return NextResponse.json({ error: 'API keys not configured' }, { status: 500 });
    }

    // Execute SDD cycle
    const client = new ClaudeApiClient({ apiKey: claudeApiKey });
    
    // Return streaming response for real-time updates
    const stream = new ReadableStream({
      start(controller) {
        // Implement streaming execution with progress updates
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('SDD execution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 5. Secret Management for Claude API

Configure secure storage of Claude API keys using our existing secret management infrastructure.

```yaml
# k8s/hq-kevinryan-io/external-secret-claude.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: hq-claude-api
  namespace: hq-kevinryan-io
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-kv-secret-store
    kind: SecretStore
  target:
    name: hq-claude-api
    creationPolicy: Owner
    template:
      type: Opaque
      data:
        CLAUDE_API_KEY: "{{ .claudeApiKey | toString }}"
  data:
  - secretKey: claudeApiKey
    remoteRef:
      key: claude-api-key
---
# Update the HQ deployment to include the Claude API secret
# This would modify k8s/hq-kevinryan-io/deployment.yaml
```

## 6. Documentation and Examples

Create comprehensive documentation for the Claude API integration.

```markdown
# docs/sdd-automation.md
# SDD Automation with Claude API

This document describes how to use Claude API integration to automate the Spec-Driven Development workflow.

## Quick Start

1. Ensure Claude API key is configured in Azure Key Vault
2. Write a spec using the SDD template
3. Execute via CLI: `sdd execute .sdd/specification/spec-NNNN-my-feature.md`
4. Or use the HQ web interface

## CLI Usage

### Execute a Specification
```bash
sdd execute .sdd/specification/spec-0013-claude-api-integration.md --max-cycles 3
```

### Validate Only
```bash
sdd validate .sdd/specification/spec-0013-claude-api-integration.md
```

## Web Interface

1. Navigate to HQ → SDD Automation
2. Select a specification file
3. Click "Execute" to start the automated cycle
4. Monitor progress in real-time

## How It Works

1. **Builder Agent Phase:** Claude reads the spec and implements all requirements
2. **Testing Agent Phase:** Claude generates scenarios and tests
3. **Iteration:** If tests fail, Claude fixes the implementation
4. **Completion:** All tests pass or max cycles reached

## Best Practices

- Write clear, unambiguous specifications
- Include all necessary context and constraints
- Review the provenance documents after execution
- Test the implementation manually before deploying

## Troubleshooting

Common issues and solutions...
```

## Constraints and Assumptions

- **Constraint:** Claude API must be available and have sufficient token limits for complex specifications
- **Constraint:** GitHub API rate limits may affect large implementations
- **Assumption:** Specifications follow the established SDD template format
- **Assumption:** All prerequisites are met before execution
- **Assumption:** Azure Key Vault contains valid Claude API keys
- **Assumption:** Users have appropriate Auth0 permissions to trigger SDD execution

## Out of Scope

- Integration with other AI providers (focus on Claude only)
- Real-time collaboration features (multiple users on same spec)
- Historical execution analytics and reporting
- Automatic deployment of successful implementations
- Integration with external CI/CD systems

## Manual steps (not performed by the agent)

1. Configure Claude API key in Azure Key Vault:
```bash
az keyvault secret set --vault-name "kra-platform-kv" --name "claude-api-key" --value "your-claude-api-key"
```

2. Deploy the updated HQ application:
```bash
kubectl apply -k k8s/hq-kevinryan-io/
```

3. Install the SDD CLI tool globally:
```bash
cd tools/sdd-cli && npm install -g .
```

Verify:

```bash
sdd --version
kubectl get secret hq-claude-api -n hq-kevinryan-io
curl -H "Authorization: Bearer $(cat ~/.auth0-token)" https://hq.kevinryan.io/api/sdd/status
```

## Provenance Record

After completing the work, create `.sdd/provenance/spec-0013-claude-api-integration.provenance.md` using the provenance template at `.sdd/provenance/template.md`.

## Validation steps

After completing all work, confirm:

1. This spec has been saved to `.sdd/specification/spec-0013-claude-api-integration.md`
2. Claude API client library exists at `apps/hq/lib/claude-api.ts` with complete implementation
3. SDD CLI tool exists at `tools/sdd-cli/src/index.ts` and builds successfully
4. HQ web interface includes SDD automation components
5. API endpoints exist at `apps/hq/app/api/sdd/` with proper authentication
6. External secret configuration exists for Claude API keys
7. Documentation exists at `docs/sdd-automation.md`
8. `terraform fmt -check -recursive infra/` passes (if Terraform files changed)
9. `pnpm lint` passes in both `apps/hq` and `tools/sdd-cli` directories
10. The provenance record exists at `.sdd/provenance/spec-0013-claude-api-integration.provenance.md` and contains all required sections
11. All files (spec, implementation, provenance) are committed together