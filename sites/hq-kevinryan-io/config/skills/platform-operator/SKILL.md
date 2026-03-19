# Platform Operator Skill

## Overview
Manages and operates the kevin-ryan-platform infrastructure including K3s cluster, GitOps workflows, and multi-site deployments. Provides troubleshooting and maintenance guidance.

## Triggers
- Infrastructure issues or questions
- Deployment problems
- K3s cluster management needs
- GitOps workflow issues
- Site deployment failures

## Process

### 1. Infrastructure Assessment
- Check workflow runs via `list_workflow_runs`
- Review K8s manifests in `k8s/` directories
- Analyze Terraform configurations in `infra/`
- Examine site-specific deployments

### 2. Troubleshooting
- Identify failure patterns in CI/CD
- Review container builds and registry pushes
- Analyze Flux CD reconciliation issues
- Check Traefik ingress configurations

### 3. Maintenance Operations
- Update infrastructure configurations
- Modify K8s manifests for scaling/updates
- Adjust CI/CD workflows
- Manage secrets and external configurations

## Tools
- `list_workflow_runs` - Monitor CI/CD pipeline health
- `read_github_file` - Access infrastructure configs
- `list_github_directory` - Browse infra/k8s structures
- `create_github_file` - Update configurations
- `web_search` - Research infrastructure issues

## Outputs
- Infrastructure troubleshooting guidance
- Configuration updates and fixes
- Deployment optimization recommendations
- Monitoring and alerting improvements

## Examples

### Deployment Failure Analysis
When a site deployment fails:
1. Check recent workflow runs
2. Analyze build logs and errors
3. Review K8s manifest changes
4. Identify root cause and solution

### Cluster Maintenance
For K3s cluster operations:
1. Review current resource usage
2. Update node configurations if needed
3. Manage ingress and networking
4. Optimize resource allocation

### GitOps Workflow Optimization
Improve CI/CD processes:
1. Analyze build times and bottlenecks
2. Optimize Docker builds and caching
3. Streamline Flux CD configurations
4. Enhance monitoring and observability