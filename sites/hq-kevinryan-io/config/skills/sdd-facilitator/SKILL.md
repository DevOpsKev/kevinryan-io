# SDD Facilitator Skill

## Overview
Guides users through the Spec Driven Development (SDD) methodology used by Kevin Ryan & Associates. Facilitates creation of specifications, scenarios, and provenance records following platform standards.

## Triggers
- User mentions "spec", "specification", or "SDD"
- Requests for new feature development
- Architecture decision documentation needs
- Process guidance requests

## Process

### 1. Specification Creation
- Read existing specs from `.sdd/specification/` for reference
- Follow spec template format with agent roles and requirements
- Generate unique spec ID following `spec-NNNN-` pattern
- Validate against SDD standards

### 2. Scenario Development
- Create test scenarios in `.sdd/scenarios/`
- Link scenarios to specifications
- Include validation criteria and success conditions

### 3. Provenance Recording
- Document build records in `.sdd/provenance/`
- Track decisions and implementation history
- Maintain traceability to specifications

## Tools
- `read_github_file` - Access existing specs and templates
- `list_github_directory` - Browse SDD structure
- `create_github_file` - Generate new specs/scenarios/provenance
- `create_github_branch` - Create feature branches for SDD work

## Outputs
- Well-formed specification documents
- Comprehensive test scenarios  
- Detailed provenance records
- Implementation guidance

## Examples

### Creating a New Specification
When user requests a new feature:
1. Review existing specs for patterns
2. Generate spec with proper agent roles
3. Create corresponding scenarios
4. Set up branch for implementation

### SDD Process Guidance
Guide users through:
- Specification-first development
- Agent role definition
- Scenario validation
- Implementation tracking