---
name: terraform-plan-safe
description: Run terraform fmt/validate/plan against infra/ without hanging the
  agent and without leaking secrets. Use for any infra/ change — Terraform
  reads TF_VAR_ secrets from the environment, so the .env.agents source-order
  flow matters, and -input=false is mandatory to avoid interactive-prompt
  freezes.
---

# Terraform Plan (Safe, Non-interactive)

## When to Use

- Any edit to `infra/` (variables, main, modules).
- Before committing infra changes or when the user asks for a plan.

## Background

Secrets are split by rule, driven by Terraform's own `sensitive = true` flag in
`infra/variables.tf`:

- `infra/terraform.tfvars` (gitignored) — **non-secret config only**:
  `location`, `vm_size`, `admin_username`, `admin_ssh_public_key`, `acr_name`,
  `keyvault_name`, `github_repo_owner`, `github_repo_name`, and the
  `cloudflare_zone_id*` public identifiers. Template: `infra/terraform.tfvars.example`.
- `.env.agents` (gitignored, single source of truth for secrets) — every
  `sensitive = true` variable, injected as `TF_VAR_<name>` (Terraform reads
  these natively; no tfvars entry needed).

`admin_ip` is **not** a tfvars/env value — it lives in `infra/admin-allowlist.tf`
as `local.admin_ip`. Edit the CIDR there and push to main to deploy via CI/CD.

Sensitive variables (set in `.env.agents` as `TF_VAR_*`):
`cloudflare_api_token`, `github_token`, `auth0_secret`, `auth0_client_id`,
`auth0_client_secret`, `auth0_domain`, `auth0_issuer_base_url`,
`anthropic_api_key`.

## Procedure

1. Ensure `.env.agents` exists (`cp .env.agents.example .env.agents` if not),
   then load it into the current shell:

   ```bash
   set -a && source .env.agents && set +a
   ```

2. Format and validate from `infra/`:

   ```bash
   cd infra
   terraform fmt
   terraform init -input=false
   terraform validate
   ```

3. Plan with `tflint` and `-input=false` (mandatory — without it, plan can
   prompt and hang the agent). Pass a `timeout` to the bash tool for safety:

   ```bash
   tflint
   terraform plan -input=false -out=/tmp/kr-tfplan.tfplan
   ```

4. To apply (only when the user explicitly asks): apply the saved plan with
   `-input=false` and `-auto-approve` only after the user confirms:

   ```bash
   terraform apply -input=false -auto-approve /tmp/kr-tfplan.tfplan
   ```

## Pitfalls

- **Never** run `terraform plan`/`apply`/`init` without `-input=false` — an
  interactive prompt blocks the MCP call and forces `herdr server stop`.
- Do **not** put `TF_VAR_*` secrets into `terraform.tfvars` — that duplicates
  them and risks committing secrets to a public repo. `.env.agents` is the
  single source.
- Do **not** set `admin_ip` via tfvars or env — edit `infra/admin-allowlist.tf`
  and push to main; CI/CD applies it.
- `terraform apply` without `-auto-approve` will prompt — always pair with
  `-auto-approve` and a saved plan, and only after explicit user confirmation.
- The repo is **public** — never let a secret reach stdout in a way that gets
  committed. `terraform plan` masks sensitive values; verify the mask holds.

## Verification

- `terraform fmt` exits 0 with no diff.
- `terraform validate` prints "Success!".
- `tflint` exits 0.
- `terraform plan` completes within the bash `timeout` and shows only masked
  sensitive values.
