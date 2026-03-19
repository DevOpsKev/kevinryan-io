# HQ Skills System

This directory contains skill modules that extend HQ's capabilities. Each skill is organized in its own directory with a standardized `SKILL.md` file.

## Structure

```
skills/
├── README.md                    # This file
├── skill-name/                  # Kebab-case directory name
│   └── SKILL.md                # Skill definition and implementation
└── another-skill/
    └── SKILL.md
```

## Skill Definition Format

Each `SKILL.md` file should contain:

- **Overview** - What the skill does
- **Triggers** - When to activate this skill
- **Process** - Step-by-step execution
- **Tools** - Which functions to use
- **Outputs** - Expected deliverables
- **Examples** - Usage scenarios

## Available Skills

- `sdd-facilitator` - Guides Spec Driven Development processes
- `platform-operator` - K3s cluster and infrastructure management
- `client-engagement` - Business development and proposals
- `code-reviewer` - Platform-specific code review standards

## Usage

Skills are automatically available to HQ and can be referenced by name or triggered contextually based on user requests.