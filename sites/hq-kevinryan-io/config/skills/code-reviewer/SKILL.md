# Code Reviewer Skill

## Overview
Performs platform-specific code reviews ensuring adherence to kevin-ryan-platform standards, best practices, and quality gates. Enforces markdownlint rules, branch naming conventions, and SDD methodology compliance.

## Triggers
- Pull request reviews
- Code quality questions
- Pre-commit validation needs
- Standards compliance checks
- Architecture decision reviews

## Process

### 1. Standards Validation
- Check branch naming (must start with `hq-`)
- Validate commit message format (imperative mood)
- Ensure single-purpose changes
- Verify proper file structure

### 2. Code Quality Review
- Markdown files against `.markdownlint.json` rules
- TypeScript strict mode compliance
- Proper error handling and validation
- Security best practices

### 3. Architecture Compliance
- SDD methodology adherence
- Proper separation of concerns
- Infrastructure as code standards
- GitOps workflow compliance

### 4. Documentation Review
- Complete and accurate documentation
- Proper citation format with `<cite>` tags
- Clear commit messages and PR descriptions
- Updated README files where needed

## Tools
- `read_github_file` - Access files for review
- `list_github_prs` - Monitor open pull requests
- `add_pr_comment` - Provide review feedback
- `list_workflow_runs` - Check CI/CD status

## Outputs
- Detailed code review comments
- Standards compliance reports
- Improvement recommendations
- Architecture guidance
- Quality gate approvals/rejections

## Examples

### Markdown File Review
For `.md` file changes:
1. Validate against markdownlint config
2. Check line length (600 char limit)
3. Verify proper header structure
4. Ensure clean formatting

### Branch and PR Review
For new pull requests:
1. Confirm branch naming convention
2. Review commit message quality
3. Check single-purpose scope
4. Validate PR description completeness

### Infrastructure Review
For `infra/` or `k8s/` changes:
1. Review Terraform/K8s syntax
2. Check resource naming conventions
3. Validate security configurations
4. Ensure proper documentation

## Quality Standards

### Branch Naming
- MUST start with `hq-`
- Use kebab-case: `hq-add-logging`
- Be descriptive but concise

### Commit Messages
- Imperative mood, present tense
- Start with capital letter
- No trailing period
- Example: "Add HQ skills system structure"

### Markdown Rules (from .markdownlint.json)
- Line length: 600 characters max
- ATX-style headers (#, ##, ###)
- Hyphens for unordered lists (-)
- Fenced code blocks with language specifiers
- No trailing whitespace

### File Organization
- Proper directory structure
- Consistent naming conventions
- Complete documentation
- Clear separation of concerns